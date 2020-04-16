import { Fragment } from 'react'
import { openModal } from '../actions/modal'
import { defineMessages, injectIntl } from 'react-intl'
import PageTitle from '../features/ui/util/page_title'
import GroupsPanel from '../components/panel/groups_panel'
import ListsPanel from '../components/panel/lists_panel'
import LinkFooter from '../components/link_footer'
import WhoToFollowPanel from '../components/panel/who_to_follow_panel'
import ProgressPanel from '../components/panel/progress_panel'
import UserPanel from '../components/panel/user_panel'
import TrendsPanel from '../components/panel/trends_panel'
import HashtagsPanel from '../components/panel/hashtags_panel'
import DefaultLayout from '../layouts/default_layout'
import TimelineComposeBlock from '../components/timeline_compose_block'
import Divider from '../components/divider'

const messages = defineMessages({
  home: { id: 'home', defaultMessage: 'Home' },
})

const mapStateToProps = (state) => ({
  totalQueuedItemsCount: state.getIn(['timelines', 'home', 'totalQueuedItemsCount']),
})

const mapDispatchToProps = (dispatch) => ({
  onOpenHomePageSettingsModal() {
    dispatch(openModal('HOME_TIMELINE_SETTINGS'))
  },
})

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class HomePage extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    totalQueuedItemsCount: PropTypes.number.isRequired,
    onOpenHomePageSettingsModal: PropTypes.func.isRequired,
  }

  render() {
    const {
      intl,
      children,
      totalQueuedItemsCount,
      onOpenHomePageSettingsModal,
    } = this.props

    return (
      <DefaultLayout
        title={intl.formatMessage(messages.home)}
        actions={[
          {
            icon: 'ellipsis',
            onClick: onOpenHomePageSettingsModal,
          },
        ]}
        layout={(
          <Fragment>
            <UserPanel />
            <ProgressPanel />
            <TrendsPanel />
            <ListsPanel />
            <HashtagsPanel />
            <WhoToFollowPanel />
            <GroupsPanel />
            <LinkFooter />
          </Fragment>
        )}
      >
        <PageTitle
          path={intl.formatMessage(messages.home)}
          badge={totalQueuedItemsCount}
        />
        <TimelineComposeBlock autoFocus={false} />
        <Divider />
        {children}
      </DefaultLayout>
    )
  }
}