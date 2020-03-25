import { Fragment } from 'react'
import { openModal } from '../actions/modal'
import GroupSidebarPanel from '../components/panel/groups_panel'
import LinkFooter from '../components/link_footer'
import WhoToFollowPanel from '../components/panel/who_to_follow_panel'
import ProgressPanel from '../components/panel/progress_panel'
import UserPanel from '../components/panel/user_panel'
import TrendsPanel from '../components/panel/trends_panel'
import HashtagsPanel from '../components/panel/hashtags_panel'
import DefaultLayout from '../layouts/default_layout'
import TimelineComposeBlock from '../components/timeline_compose_block'
import Divider from '../components/divider'

const mapDispatchToProps = (dispatch) => ({
  onOpenHashtagPageSettingsModal(hashtag) {
    dispatch(openModal('HASHTAG_TIMELINE_SETTINGS', {
      hashtag,
    }))
  },
})

export default
@connect(null, mapDispatchToProps)
class HashtagPage extends PureComponent {

  static propTypes = {
    onOpenHashtagPageSettingsModal: PropTypes.func.isRequired,
  }

  componentDidMount() {
    document.title = '(1) Tag - Gab'
  }

  render() {
    const { children, onOpenHashtagPageSettingsModal } = this.props

    return (
      <DefaultLayout
        title='Hashtag'
        actions={[
          {
            icon: 'ellipsis',
            onClick: onOpenHashtagPageSettingsModal,
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
        {children}
      </DefaultLayout>
    )
  }
}