import { Fragment } from 'react'
import PageTitle from '../features/ui/util/page_title'
import DefaultLayout from '../layouts/default_layout'
import ProgressPanel from '../components/panel/progress_panel'
import VerifiedAccountsPanel from '../components/panel/verified_accounts_panel'
import ShopPanel from '../components/panel/shop_panel'
import LinkFooter from '../components/link_footer'

export default class ExplorePage extends PureComponent {

  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  }

  render() {
    const { children, title } = this.props

    return (
      <DefaultLayout
        title={title}
        noComposeButton
        showBackBtn
        layout={(
          <Fragment>
            <ProgressPanel />
            <VerifiedAccountsPanel />
            <ShopPanel />
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