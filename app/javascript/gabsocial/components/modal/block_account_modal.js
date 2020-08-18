import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { injectIntl, defineMessages } from 'react-intl'
import { makeGetAccount } from '../../selectors'
import { blockAccount } from '../../actions/accounts'
import ConfirmationModal from './confirmation_modal'

class BlockAccountModal extends React.PureComponent {

  handleClick = () => {
    this.props.onConfirm(this.props.account)
  }

  render() {
    const { account, intl, onClose } = this.props

    const title = intl.formatMessage(messages.title, {
      name: !!account ? account.get('acct') : '',
    })
    const message = intl.formatMessage(messages.muteMessage, {
      name: !!account ? account.get('acct') : '',
    })

    return (
      <ConfirmationModal
        title={title}
        message={message}
        confirm={intl.formatMessage(messages.block)}
        onConfirm={this.handleClick}
        onClose={onClose}
      />
    )
  }

}

const messages = defineMessages({
  title: { id: 'block_title', defaultMessage: 'Block {name}' },
  muteMessage: { id: 'confirmations.block.message', defaultMessage: 'Are you sure you want to block {name}?' },
  block: { id: 'confirmations.block.confirm', defaultMessage: 'Block' },
})

const mapStateToProps = (state, { accountId }) => ({
  account: makeGetAccount()(state, accountId),
})

const mapDispatchToProps = (dispatch) => ({
  onConfirm(account) {
    dispatch(blockAccount(account.get('id')))
  },
})

BlockAccountModal.propTypes = {
  account: PropTypes.object.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(BlockAccountModal))