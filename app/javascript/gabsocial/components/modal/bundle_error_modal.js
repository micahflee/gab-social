import React from 'react'
import PropTypes from 'prop-types'
import { defineMessages, injectIntl } from 'react-intl'
import ConfirmationModal from './confirmation_modal'

class BundleErrorModal extends React.PureComponent {

  handleRetry = () => {
    this.props.onRetry()
  }

  render () {
    const { onClose, intl } = this.props

    return (
      <ConfirmationModal
        title={intl.formatMessage(messages.title)}
        message={intl.formatMessage(messages.error)}
        confirm={intl.formatMessage(messages.retry)}
        onConfirm={this.handleRetry}
        onClose={onClose}
      />
    )
  }

}

const messages = defineMessages({
  error: { id: 'bundle_modal_error.message', defaultMessage: 'Something went wrong while loading this component.' },
  retry: { id: 'bundle_modal_error.retry', defaultMessage: 'Try again' },
  title: { id: 'bundle_modal_error.error', defaultMessage: 'Error' },
})

BundleErrorModal.propTypes = {
  onRetry: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
}

export default injectIntl(BundleErrorModal)