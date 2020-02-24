import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import Button from '../button'
import Text from '../text'
import ModalLayout from './modal_layout'

const messages = defineMessages({
  title: { id: 'promo.gab_pro', defaultMessage: 'Upgrade to GabPRO' },
  text: { id: 'pro_upgrade_modal.text', defaultMessage: 'Gab is fully funded by people like you. Please consider supporting us on our mission to defend free expression online for all people.' },
  benefits: { id: 'pro_upgrade_modal.benefits', defaultMessage: 'Here are just some of the benefits that thousands of GabPRO members receive:' },
})

export default
@injectIntl
class ProUpgradeModal extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  render() {
    const { intl } = this.props

    return (
      <ModalLayout title={intl.formatMessage(messages.title)}>
        <div>
          <Text>
            {intl.formatMessage(messages.text)}
          </Text>
          <Text>
            {intl.formatMessage(messages.benefits)}
          </Text>
        </div>

        <ul>
          <li>
            <Text>Schedule Posts</Text>
          </li>
          <li>
            <Text>Get Verified</Text>
          </li>
          <li>
            <Text>Create Groups</Text>
          </li>
          <li>
            <Text>Larger Video and Image Uploads</Text>
          </li>
          <li>
            <Text>Receive the PRO Badge</Text>
          </li>
          <li>
            <Text>Remove in-feed promotions</Text>
          </li>
        </ul>

        <Button icon='pro' href='https://pro.gab.com'>
          {intl.formatMessage(messages.title)}
        </Button>

      </ModalLayout>
    )
  }
}
