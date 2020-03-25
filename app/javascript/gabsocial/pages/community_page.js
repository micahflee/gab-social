import { Fragment } from 'react'
import { openModal } from '../actions/modal'
import GroupSidebarPanel from '../components/panel/groups_panel'
import LinkFooter from '../components/link_footer'
import WhoToFollowPanel from '../components/panel/who_to_follow_panel'
import ProgressPanel from '../components/panel/progress_panel'
import TrendsPanel from '../components/panel/trends_panel'
import HashtagsPanel from '../components/panel/hashtags_panel'
import DefaultLayout from '../layouts/default_layout'
import TimelineComposeBlock from '../components/timeline_compose_block'
import Divider from '../components/divider'

const mapDispatchToProps = (dispatch) => ({
  onOpenCommunityPageSettingsModal() {
    dispatch(openModal('COMMUNITY_TIMELINE_SETTINGS'))
  },
})

export default
@connect(null, mapDispatchToProps)
class CommunityPage extends PureComponent {

  static propTypes = {
    onOpenCommunityPageSettingsModal: PropTypes.func.isRequired,
  }

  componentDidMount() {
    document.title = '(1) Community - Gab'
  }

  render() {
    const { children, onOpenCommunityPageSettingsModal } = this.props

    return (
      <DefaultLayout
        title='Community Timeline'
        actions={[
          {
            icon: 'ellipsis',
            onClick: onOpenCommunityPageSettingsModal,
          },
        ]}
        layout={(
          <Fragment>
            <ProgressPanel />
            <TrendsPanel />
            <HashtagsPanel />
            <WhoToFollowPanel />
            <GroupSidebarPanel />
            <LinkFooter />
          </Fragment>
        )}
      >
        <TimelineComposeBlock autoFocus={false} />
        <Divider />
        {children}
      </DefaultLayout>
    )
  }
}