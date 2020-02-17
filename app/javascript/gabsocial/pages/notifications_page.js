import { Fragment } from 'react'
import LinkFooter from '../components/link_footer'
import WhoToFollowPanel from '../components/panel/who_to_follow_panel'
import TrendsPanel from '../components/panel/trends_panel'
import DefaultLayout from '../components/layouts/default_layout'

export default class NotificationsPage extends PureComponent {
  render() {
    const { children } = this.props

    return (
      <DefaultLayout
        title='Notifications'
        layout={(
          <Fragment>
            <TrendsPanel />
            <WhoToFollowPanel />
            <LinkFooter />
          </Fragment>
        )}
      >
        {children}
      </DefaultLayout>
    )
  }
}