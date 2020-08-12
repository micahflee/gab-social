import PageTitle from '../features/ui/util/page_title'
import DefaultLayout from '../layouts/default_layout'
import {
  LinkFooter,
  TrendsPanel,
  WhoToFollowPanel,
} from '../features/ui/util/async_components'

export default class BasicPage extends PureComponent {

  static propTypes = {
    children: PropTypes.node.isRequired,
    page: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }

  render() {
    const {
      children,
      page,
      title,
    } = this.props

    return (
      <DefaultLayout
        noComposeButton
        showBackBtn
        title={title}
        page={page}
        layout={[
          TrendsPanel,
          WhoToFollowPanel,
          LinkFooter,
        ]}
      >
        <PageTitle path={title} />
        {children}
      </DefaultLayout>
    )
  }

}