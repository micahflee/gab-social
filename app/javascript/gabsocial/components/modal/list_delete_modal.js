import { injectIntl, defineMessages } from 'react-intl'
import { makeGetAccount } from '../../selectors'
import { blockAccount } from '../../actions/accounts'
import ConfirmationModal from './confirmation_modal'

const messages = defineMessages({
  title: { id: 'list_delete_title', defaultMessage: 'Delete "{list}"' },
  listMessage: { id: 'confirmations.list_delete.message', defaultMessage: 'Are you sure you want to delete "{list}"?' },
  delete: { id: 'delete', defaultMessage: 'Delete' },
})

const mapDispatchToProps = dispatch => {
  return {
    onConfirm(account) {
      // dispatch(blockAccount(account.get('id')))
    },
  }
}

export default
@connect(null, mapDispatchToProps)
@injectIntl
class ListDeleteModal extends PureComponent {

  static propTypes = {
    list: PropTypes.object.isRequired,
    onConfirm: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  }

  handleClick = () => {
    this.props.onConfirm(this.props.account)
  }

  render() {
    const { list, intl } = this.props

    const title = intl.formatMessage(messages.title, {
      list: !!list ? account.get('title') : '',
    })
    const message = intl.formatMessage(messages.listMessage, {
      list: !!list ? account.get('title') : '',
    })

    return (
      <ConfirmationModal
        title={title}
        message={message}
        confirm={intl.formatMessage(messages.delete)}
        onConfirm={this.handleClick}
      />
    )
  }

}
