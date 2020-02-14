import { Fragment } from 'react'
import GroupSidebarPanel from '../components/panel/groups_panel'
import LinkFooter from '../components/link_footer'
import SignUpPanel from '../components/panel/sign_up_panel'
import WhoToFollowPanel from '../components/panel/who_to_follow_panel'
import TrendsPanel from '../components/panel/trends_panel'
import ProgressPanel from '../components/panel/progress_panel'
import UserPanel from '../components/user_panel'
import Search from '../components/search'
import PageLayout from '../components/page_layout'
import TimelineComposeBlock from '../components/timeline_compose_block'

export default class HomePage extends PureComponent {
  render() {
    const { children } = this.props

    return (
      <PageLayout
        title='Home'
        layout={{
          HEADER_RIGHT: <Search />,
          RIGHT: (
            <Fragment>
              <UserPanel />
              <WhoToFollowPanel />
              <TrendsPanel />
              <GroupSidebarPanel />
              <SignUpPanel />
              <ProgressPanel />
              <LinkFooter />
            </Fragment>
          ),
        }}
      >
        <TimelineComposeBlock autoFocus={false} shouldCondense />
        <div className={[styles.default, styles.borderBottom1PX, styles.borderColorSubtle2, styles.marginBottom15PX, styles.width100PC].join(' ')} />
        {children}
      </PageLayout>
    )
  }
}