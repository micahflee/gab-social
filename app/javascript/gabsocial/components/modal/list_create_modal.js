import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ModalLayout from './modal_layout'
import ListCreate from '../../features/list_create'

const messages = defineMessages({
  title: { id: 'create_list', defaultMessage: 'Create List' },
})

export default
@injectIntl
class ListCreateModal extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  render() {
    const { intl } = this.props

    return (
      <ModalLayout
        title={intl.formatMessage(messages.title)}
        width='500'
      >
        <ListCreate />
      </ModalLayout>
    )
  }
}
