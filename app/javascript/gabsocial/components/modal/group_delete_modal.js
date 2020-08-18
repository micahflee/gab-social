import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { injectIntl, defineMessages } from 'react-intl'
import { makeGetAccount } from '../../selectors'
import { blockAccount } from '../../actions/accounts'
import ConfirmationModal from './confirmation_modal'

class GroupDeleteModal extends React.PureComponent {

  handleClick = () => {
    this.props.onConfirm(this.props.account)
  }

  render() {
    const { group, intl, onClose } = this.props

    const title = intl.formatMessage(messages.title, {
      group: !!group ? account.get('title') : '',
    })
    const message = intl.formatMessage(messages.groupMessage, {
      group: !!group ? account.get('title') : '',
    })

    return (
      <ConfirmationModal
        title={title}
        message={message}
        confirm={intl.formatMessage(messages.delete)}
        onConfirm={this.handleClick}
        onClose={onClose}
      />
    )
  }

}

const messages = defineMessages({
  title: { id: 'group_delete_title', defaultMessage: 'Delete "{group}"' },
  groupMessage: { id: 'confirmations.group_delete.message', defaultMessage: 'Are you sure you want to delete "{group}"?' },
  delete: { id: 'delete', defaultMessage: 'Delete' },
})

const mapDispatchToProps = (dispatch) => ({
  onConfirm(account) {
    // dispatch(blockAccount(account.get('id')))
  },
})

GroupDeleteModal.propTypes = {
  group: PropTypes.object.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
}

export default injectIntl(connect(null, mapDispatchToProps)(GroupDeleteModal))