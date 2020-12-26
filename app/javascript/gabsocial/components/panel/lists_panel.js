import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { defineMessages, injectIntl } from 'react-intl'
import { getOrderedLists } from '../../selectors'
import { fetchLists } from '../../actions/lists'
import PanelLayout from './panel_layout'
import List from '../list'

class ListsPanel extends ImmutablePureComponent {

  state = {
    fetched: false,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.shouldLoad && !prevState.fetched) {
      return { fetched: true }
    }

    return null
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.fetched && this.state.fetched) {
      this.props.onFetchLists()
    }
  }

  componentDidMount() {
    if (!this.props.isLazy) {
      this.props.onFetchLists()
      this.setState({ fetched: true })
    }
  }

  render() {
    const { intl, lists } = this.props
    const { fetched } = this.state

    const count = !!lists ? lists.count() : 0

    if (count === 0 && fetched) return null
    
    const maxCount = 6

    const listItems = !!lists && lists.slice(0, maxCount).map((list) => ({
      to: `/lists/${list.get('id')}`,
      title: list.get('title'),
    }))

    return (
      <PanelLayout
        title={intl.formatMessage(messages.title)}
        headerButtonTitle={intl.formatMessage(messages.show_all)}
        headerButtonTo='/lists'
        footerButtonTitle={count > maxCount ? intl.formatMessage(messages.show_all) : undefined}
        footerButtonTo={count > maxCount ? '/lists' : undefined}
        noPadding
      >
        <div className={[_s.d, _s.boxShadowNone].join(' ')}>
          <List
            scrollKey='lists_sidebar_panel'
            items={listItems}
            showLoading={!fetched}
          />
        </div>
      </PanelLayout>
    )
  }

}

const messages = defineMessages({
  title: { id: 'lists.subheading', defaultMessage: 'Your Lists' },
  show_all: { id: 'groups.sidebar-panel.show_all', defaultMessage: 'Show all' },
})

const mapStateToProps = (state) => ({
  lists: getOrderedLists(state),
})

const mapDispatchToProps = (dispatch) => ({
  onFetchLists: () => dispatch(fetchLists()),
})

ListsPanel.propTypes = {
  onFetchLists: PropTypes.func.isRequired,
  lists: ImmutablePropTypes.list,
  intl: PropTypes.object.isRequired,
  isLazy: PropTypes.bool,
  shouldLoad: PropTypes.bool,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ListsPanel))