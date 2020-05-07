import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ModalLayout from './modal_layout'
import GroupCreate from '../../features/group_create'

const messages = defineMessages({
  title: { id: 'create_group', defaultMessage: 'Create group' },
})

export default
@injectIntl
class GroupMembersModal extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
  }

  render() {
    const { intl, onClose } = this.props

    return (
      <ModalLayout
        title={intl.formatMessage(messages.title)}
        width={440}
        onClose={onClose}
      >
        <GroupCreate onCloseModal={onClose} />
      </ModalLayout>
    )
  }
}
