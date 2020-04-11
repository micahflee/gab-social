import { Fragment } from 'react'
import { openModal } from '../actions/modal'
import PageTitle from '../features/ui/util/page_title'
import LinkFooter from '../components/link_footer'
import WhoToFollowPanel from '../components/panel/who_to_follow_panel'
import TrendsPanel from '../components/panel/trends_panel'
import DefaultLayout from '../layouts/default_layout'

const mapDispatchToProps = (dispatch) => ({
  onOpenListCreateModal() {
    dispatch(openModal('LIST_CREATE'))
  },
})

export default
@connect(null, mapDispatchToProps)
class ListsPage extends PureComponent {

  static propTypes = {
    onOpenListCreateModal: PropTypes.func.isRequired,
  }

  componentDidMount() {
    document.title = 'Lists - Gab'
  }

  render() {
    const { children, onOpenListCreateModal } = this.props

    return (
      <DefaultLayout
        title='Lists'
        actions={[
          {
            icon: 'add',
            onClick: onOpenListCreateModal,
          },
        ]}
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