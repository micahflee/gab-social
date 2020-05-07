import { Fragment } from 'react'
import PageTitle from '../features/ui/util/page_title'
import DefaultLayout from '../layouts/default_layout'
import LinkFooter from '../components/link_footer'
import TrendsPanel from '../components/panel/trends_panel'
import WhoToFollowPanel from '../components/panel/who_to_follow_panel'

export default class BasicPage extends PureComponent {

  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  }

  render() {
    const { children, title } = this.props

    return (
      <DefaultLayout
        noComposeButton
        showBackBtn
        title={title}
        layout={(
          <Fragment>
            <TrendsPanel />
            <WhoToFollowPanel />
            <LinkFooter />
          </Fragment>
        )}
      >
        <PageTitle path={title} />
        {children}
      </DefaultLayout>
    )
  }

}