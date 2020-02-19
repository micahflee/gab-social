import { Fragment } from 'react'
import GroupSidebarPanel from '../components/panel/groups_panel'
import LinkFooter from '../components/link_footer'
import WhoToFollowPanel from '../components/panel/who_to_follow_panel'
import ProgressPanel from '../components/panel/progress_panel'
import UserPanel from '../components/panel/user_panel'
import TrendsPanel from '../components/panel/trends_panel'
import HashtagsPanel from '../components/panel/hashtags_panel'
import DefaultLayout from '../components/layouts/default_layout'
import TimelineComposeBlock from '../components/timeline_compose_block'
import Divider from '../components/divider'

export default class HomePage extends PureComponent {

  handleEditHomeTimeline () {
    console.log("handleEditHomeTimeline")
  }

  render() {
    const { children } = this.props

    return (
      <DefaultLayout
        title='Home'
        actions={[
          {
            icon: 'ellipsis',
            onClick: this.handleEditHomeTimeline
          },
        ]}
        layout={(
          <Fragment>
            <UserPanel />
            <ProgressPanel />
            <TrendsPanel />
            <HashtagsPanel />
            <WhoToFollowPanel />
            <GroupSidebarPanel />
            <LinkFooter />
          </Fragment>
        )}
      >
        <TimelineComposeBlock autoFocus={false} shouldCondense />
        <Divider />
        {children}
      </DefaultLayout>
    )
  }
}