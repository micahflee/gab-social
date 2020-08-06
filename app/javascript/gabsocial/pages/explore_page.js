import PageTitle from '../features/ui/util/page_title'
import ExploreLayout from '../layouts/explore_layout'

export default class ExplorePage extends PureComponent {

  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  }

  render() {
    const { children, title } = this.props

    return (
      <ExploreLayout
        page='explore'
        title={title}
      >
        <PageTitle path={title} />
        {children}
      </ExploreLayout>
    )
  }

}