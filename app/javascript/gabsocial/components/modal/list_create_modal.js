import React from 'react'
import PropTypes from 'prop-types'
import { defineMessages, injectIntl } from 'react-intl'
import ModalLayout from './modal_layout'
import ListCreate from '../../features/list_create'

class ListCreateModal extends React.PureComponent {

  render() {
    const { intl, onClose } = this.props

    return (
      <ModalLayout
        title={intl.formatMessage(messages.title)}
        width={500}
        onClose={onClose}
      >
        <ListCreate isModal />
      </ModalLayout>
    )
  }

}

const messages = defineMessages({
  title: { id: 'create_list', defaultMessage: 'Create List' },
})

ListCreateModal.propTypes = {
  intl: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default injectIntl(ListCreateModal)