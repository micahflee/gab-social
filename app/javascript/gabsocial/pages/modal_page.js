import PageTitle from '../features/ui/util/page_title'
import Block from '../components/block'
import DefaultLayout from '../layouts/default_layout'
import {
  LinkFooter,
  WhoToFollowPanel,
} from '../features/ui/util/async_components'

export default class ModalPage extends PureComponent {

  static propTypes = {
    title: PropTypes.string,
    page: PropTypes.string,
    children: PropTypes.node,
  }

  render() {
    const {
      children,
      title,
      page,
    } = this.props

    return (
      <DefaultLayout
        title={title}
        page={page}
        showBackBtn
        layout={[
          WhoToFollowPanel,
          LinkFooter,
        ]}
      >
        <PageTitle path={title} />
        
        <Block>
          <div className={[_s.default, _s.py15, _s.px15].join(' ')}>
            {children}
          </div>
        </Block>
      </DefaultLayout>
    )
  }

}