import { Fragment } from 'react'
import { openModal } from '../actions/modal'
import GroupSidebarPanel from '../components/panel/groups_panel'
import LinkFooter from '../components/link_footer'
import WhoToFollowPanel from '../components/panel/who_to_follow_panel'
import ProgressPanel from '../components/panel/progress_panel'
import UserPanel from '../components/panel/user_panel'
import TrendsPanel from '../components/panel/trends_panel'
import DefaultLayout from '../layouts/default_layout'

export default
class ShortcutsPage extends PureComponent {

  render() {
    const { children } = this.props

    return (
      <DefaultLayout
        title='Shortcuts'
        actions={[]}
        layout={(
          <Fragment>
            <UserPanel />
            <ProgressPanel />
            <TrendsPanel />
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