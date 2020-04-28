import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ModalLayout from './modal_layout'
import ListEdit from '../../features/list_edit'

const messages = defineMessages({
  title: { id: 'lists.edit', defaultMessage: 'Edit list' },
})

export default
@injectIntl
class ListEditorModal extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    listId: PropTypes.string.isRequired,
  }

  render() {
    const { intl, onClose, listId } = this.props

    return (
      <ModalLayout
        title={intl.formatMessage(messages.title)}
        width={500}
        onClose={onClose}
      >
        <ListEdit listId={listId} />
      </ModalLayout>
    )
  }
}
