import { Fragment } from 'react'
import LinkFooter from '../components/link_footer'
import WhoToFollowPanel from '../components/panel/who_to_follow_panel'
import TrendsPanel from '../components/panel/trends_panel'
import DefaultLayout from '../layouts/default_layout'

export default class BasicPage extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.node,
  }

  render() {
    const { children, title } = this.props

    return (
      <DefaultLayout
        title={title}
        layout={(
          <Fragment>
            <TrendsPanel />
            <WhoToFollowPanel />
            <LinkFooter />
          </Fragment>
        )}
        showBackBtn
      >
        {children}
      </DefaultLayout>
    )
  }
}