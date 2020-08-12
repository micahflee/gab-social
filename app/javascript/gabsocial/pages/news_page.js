import PageTitle from '../features/ui/util/page_title'
import DefaultLayout from '../layouts/default_layout'
import {
  LinkFooter,
  ProgressPanel,
  ShopPanel,
  SignUpPanel,
  VerifiedAccountsPanel,
} from '../features/ui/util/async_components'

export default class NewsPage extends PureComponent {

  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  }

  render() {
    const { children, title } = this.props

    return (
      <DefaultLayout
        page='explore'
        title={title}
        noComposeButton
        showBackBtn
        layout={[
          SignUpPanel,
          ProgressPanel,
          VerifiedAccountsPanel,
          ShopPanel,
          LinkFooter,
        ]}
      >
        <PageTitle path={title} />
        {children}
      </DefaultLayout>
    )
  }

}
