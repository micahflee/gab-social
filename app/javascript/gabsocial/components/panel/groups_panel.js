import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { defineMessages, injectIntl } from 'react-intl'
import { fetchGroups } from '../../actions/groups'
import PanelLayout from './panel_layout'
import GroupListItem from '../group_list_item'
import ScrollableList from '../scrollable_list'
import GroupListItemPlaceholder from '../placeholder/group_list_item_placeholder'

const messages = defineMessages({
  memberTitle: { id: 'groups.sidebar-panel.member_title', defaultMessage: 'Groups you\'re in' },
  featuredTitle: { id: 'groups.sidebar-panel.featured_title', defaultMessage: 'Featured Groups' },
  show_all: { id: 'groups.sidebar-panel.show_all', defaultMessage: 'Show all' },
  all: { id: 'groups.sidebar-panel.all', defaultMessage: 'All' },
})

const mapStateToProps = (state, { groupType }) => ({
  groupIds: state.getIn(['group_lists', groupType, 'items']),
})

const mapDispatchToProps = (dispatch) => ({
  onFetchGroups: (type) => dispatch(fetchGroups(type))
})

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class GroupsPanel extends ImmutablePureComponent {

  static propTypes = {
    groupIds: ImmutablePropTypes.list,
    isLazy: PropTypes.bool, 
    onFetchGroups: PropTypes.func.isRequired,
    shouldLoad: PropTypes.bool,
    groupType: PropTypes.string,
  }

  static defaultProps = {
    groupType: 'member'
  }

  state = {
    fetched: false,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.shouldLoad && !prevState.fetched) {
      return { fetched: true }
    }

    return null
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!prevState.fetched && this.state.fetched) {
      this.props.onFetchGroups(this.props.groupType)
    }
  }

  componentDidMount() {
    if (!this.props.isLazy) {
      this.props.onFetchGroups(this.props.groupType)
      this.setState({ fetched: true })
    }
  }
  
  render() {
    const {
      intl,
      groupIds,
      groupType,
    } = this.props
    const { fetched } = this.state

    const count = !!groupIds ? groupIds.count() : 0
    const maxCount = 12

    if (count === 0 && fetched) return null

    return (
      <PanelLayout
        title={intl.formatMessage(groupType === 'member' ? messages.memberTitle : messages.featuredTitle)}
        headerButtonTitle={intl.formatMessage(messages.all)}
        headerButtonTo={groupType === 'member' ? '/groups/browse/member' : '/groups/browse/featured'}
        footerButtonTitle={count > maxCount ? intl.formatMessage(messages.show_all) : undefined}
        footerButtonTo={count > maxCount ? '/groups' : undefined}
        noPadding
      >
        <ScrollableList
          scrollKey='groups_panel'
          showLoading={!fetched}
          placeholderComponent={GroupListItemPlaceholder}
          placeholderCount={6}
        >
          {
            groupIds && groupIds.slice(0, maxCount).map((groupId, i) => (
              <GroupListItem
                key={`group-panel-item-${groupId}`}
                id={groupId}
                isLast={groupIds.count() - 1 === i}
              />
            ))
          }
        </ScrollableList>
      </PanelLayout>
    )
  }

}