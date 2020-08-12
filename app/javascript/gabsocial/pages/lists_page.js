import { openModal } from '../actions/modal'
import { defineMessages, injectIntl } from 'react-intl'
import PageTitle from '../features/ui/util/page_title'
import DefaultLayout from '../layouts/default_layout'
import {
  LinkFooter,
  TrendsPanel,
  WhoToFollowPanel,
} from '../features/ui/util/async_components'

const messages = defineMessages({
  lists: { id: 'lists', defaultMessage: 'Lists' },
})

const mapDispatchToProps = (dispatch) => ({
  onOpenListCreateModal() {
    dispatch(openModal('LIST_CREATE'))
  },
})

export default
@injectIntl
@connect(null, mapDispatchToProps)
class ListsPage extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    onOpenListCreateModal: PropTypes.func.isRequired,
  }

  render() {
    const {
      intl,
      children,
      onOpenListCreateModal,
    } = this.props

    return (
      <DefaultLayout
        title={intl.formatMessage(messages.lists)}
        page='lists'
        actions={[
          {
            icon: 'add',
            onClick: onOpenListCreateModal,
          },
        ]}
        layout={[
          TrendsPanel,
          WhoToFollowPanel,
          LinkFooter,
        ]}
        showBackBtn
      >
        <PageTitle path={intl.formatMessage(messages.lists)} />
        {children}
      </DefaultLayout>
    )
  }

}