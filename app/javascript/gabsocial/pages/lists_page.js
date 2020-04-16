import { Fragment } from 'react'
import { openModal } from '../actions/modal'
import { defineMessages, injectIntl } from 'react-intl'
import PageTitle from '../features/ui/util/page_title'
import LinkFooter from '../components/link_footer'
import WhoToFollowPanel from '../components/panel/who_to_follow_panel'
import TrendsPanel from '../components/panel/trends_panel'
import DefaultLayout from '../layouts/default_layout'

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
        <PageTitle path={intl.formatMessage(messages.lists)} />
        {children}
      </DefaultLayout>
    )
  }

}