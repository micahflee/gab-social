import { Fragment } from 'react'
import GroupSidebarPanel from '../components/panel/groups_panel'
import LinkFooter from '../components/link_footer'
import WhoToFollowPanel from '../components/panel/who_to_follow_panel'
import ProgressPanel from '../components/panel/progress_panel'
import UserPanel from '../components/user_panel'
import DefaultLayout from '../components/layouts/default_layout'
import TimelineComposeBlock from '../components/timeline_compose_block'

export default class HomePage extends PureComponent {
  render() {
    const { children } = this.props

    return (
      <DefaultLayout
        title='Home'
        layout={(
          <Fragment>
            <UserPanel />
            <ProgressPanel />
            <WhoToFollowPanel />
            <GroupSidebarPanel />
            <LinkFooter />
          </Fragment>
        )}
      >
        <TimelineComposeBlock autoFocus={false} shouldCondense />
        <div className={[styles.default, styles.borderBottom1PX, styles.borderColorSubtle2, styles.marginBottom15PX, styles.width100PC].join(' ')} />
        {children}
      </DefaultLayout>
    )
  }
}