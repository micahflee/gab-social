import React from 'react'
import PropTypes from 'prop-types'
import { defineMessages, injectIntl } from 'react-intl'
import ModalLayout from './modal_layout'
import { GroupCreate } from '../../features/ui/util/async_components'
import WrappedBundle from '../../features/ui/util/wrapped_bundle'

class GroupCreateModal extends React.PureComponent {

  render() {
    const { intl, onClose, groupId } = this.props

    const title = intl.formatMessage(groupId ? messages.update : messages.title)

    return (
      <ModalLayout
        title={title}
        width={440}
        onClose={onClose}
      >
        <WrappedBundle component={GroupCreate} componentParams={{ id: groupId, onCloseModal: onClose }} />
      </ModalLayout>
    )
  }

}

const messages = defineMessages({
  title: { id: 'create_group', defaultMessage: 'Create group' },
  update: { id: 'groups.form.update', defaultMessage: 'Update group' },
})

GroupCreateModal.propTypes = {
  intl: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  groupId: PropTypes.string,
}

export default injectIntl(GroupCreateModal)