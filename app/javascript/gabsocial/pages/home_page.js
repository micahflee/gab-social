import { Fragment } from 'react'
import { openModal } from '../actions/modal'
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

const mapDispatchToProps = (dispatch) => ({
  onOpenHomePageSettingsModal() {
    dispatch(openModal('HOME_TIMELINE_SETTINGS'))
  },
})

export default
@connect(null, mapDispatchToProps)
class HomePage extends PureComponent {

  static propTypes = {
    onOpenHomePageSettingsModal: PropTypes.func.isRequired,
  }

  componentDidMount() {
    document.title = '(1) Home - Gab'
  }

  render() {
    const { children, onOpenHomePageSettingsModal } = this.props

    return (
      <DefaultLayout
        title='Home'
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
        <TimelineComposeBlock autoFocus={false} />
        <Divider />
        {children}
      </DefaultLayout>
    )
  }
}