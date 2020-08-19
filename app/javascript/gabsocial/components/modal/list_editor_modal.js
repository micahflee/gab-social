import React from 'react'
import PropTypes from 'prop-types'
import { defineMessages, injectIntl } from 'react-intl'
import ModalLayout from './modal_layout'
import { ListEdit } from '../../features/ui/util/async_components'
import WrappedBundle from '../../features/ui/util/wrapped_bundle'

class ListEditorModal extends React.PureComponent {

  render() {
    const { intl, onClose, id } = this.props

    return (
      <ModalLayout
        title={intl.formatMessage(messages.title)}
        width={500}
        onClose={onClose}
        noPadding
      >
        <WrappedBundle component={ListEdit} componentParams={{ id }} />
      </ModalLayout>
    )
  }

}

const messages = defineMessages({
  title: { id: 'lists.edit', defaultMessage: 'Edit list' },
})

ListEditorModal.propTypes = {
  intl: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
}

export default injectIntl(ListEditorModal)