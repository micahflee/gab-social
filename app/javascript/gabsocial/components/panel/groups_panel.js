import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { defineMessages, injectIntl } from 'react-intl'
import PanelLayout from './panel_layout'
import GroupListItem from '../group_list_item'
import Button from '../button'

const messages = defineMessages({
  title: { id: 'groups.sidebar-panel.title', defaultMessage: 'Groups you\'re in' },
  show_all: { id: 'groups.sidebar-panel.show_all', defaultMessage: 'Show all' },
  all: { id: 'groups.sidebar-panel.all', defaultMessage: 'All' },
})

const mapStateToProps = (state) => ({
  groupIds: state.getIn(['group_lists', 'member']),
})

export default @connect(mapStateToProps)
@injectIntl
class GroupSidebarPanel extends ImmutablePureComponent {
  static propTypes = {
    groupIds: ImmutablePropTypes.list,
    slim: PropTypes.bool,
  }

  render() {
    const { intl, groupIds, slim } = this.props
    const count = groupIds.count()

    if (count === 0) return null

    const maxCount = slim ? 12 : 6

    return (
      <PanelLayout
        title={intl.formatMessage(messages.title)}
        headerButtonTitle={intl.formatMessage(messages.all)}
        headerButtonTo='/groups/browse/member'
        footerButtonTitle={count > maxCount ? intl.formatMessage(messages.show_all) : undefined}
        footerButtonTo={count > maxCount ? '/groups/browse/member' : undefined}
        noPadding={slim}
      >
        <div className={_s.default}>
          {
            groupIds.slice(0, maxCount).map((groupId, i) => (
              <GroupListItem
                key={`group-panel-item-${groupId}`}
                id={groupId}
                slim={slim}
                isLast={groupIds.length - 1 === i}
              />
            ))
          }
        </div>
      </PanelLayout>
    )
  }
}