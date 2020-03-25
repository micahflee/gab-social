import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ModalLayout from './modal_layout'
import GroupCreate from '../../features/group_create'

const messages = defineMessages({
  title: { id: 'create_group', defaultMessage: 'Create Group' },
})

export default
@injectIntl
class GroupCreateModal extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  render() {
    const { intl } = this.props

    return (
      <ModalLayout
        title={intl.formatMessage(messages.title)}
        width='440'
      >
        <GroupCreate />
      </ModalLayout>
    )
  }
}
