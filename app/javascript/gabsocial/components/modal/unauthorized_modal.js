import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ModalLayout from './modal_layout'
import Text from '../text'
import Button from '../button'

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
  signup: { id: 'unauthorized_modal.title', defaultMessage: 'Sign up for Gab' },
  text: { id: 'unauthorized_modal.text', defaultMessage: 'You need to be logged in to do that.' },
  register: { id: 'account.register', defaultMessage: 'Sign up' },
  alreadyHaveAccount: { id: 'unauthorized_modal.footer', defaultMessage: 'Already have an account? {login}.' },
  login: { id: 'account.login', defaultMessage: 'Log in' },
})

export default
@injectIntl
class UnauthorizedModal extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  render() {
    const { intl } = this.props

    return (
      <ModalLayout title={intl.formatMessage(messages.signup)}>
        <div className={[_s.default, _s.paddingHorizontal10PX, _s.paddingVertical10PX].join(' ')}>
          <Text className={_s.marginBottom15PX}>
            {intl.formatMessage(messages.text)}
          </Text>
          <Button href='/auth/sign_up' className={[_s.width240PX, _s.marginLeftAuto, _s.marginLeftAuto].join(' ')}>
            {intl.formatMessage(messages.register)}
          </Button>
        </div>
        <div className={[_s.default, _s.paddingHorizontal10PX, _s.paddingVertical10PX].join(' ')}>
          <Text color='secondary'>
            {
              intl.formatMessage(messages.login, {
                login: (
                  <Button text href='/auth/sign_in'>
                    {intl.formatMessage(messages.login)}
                  </Button>
                )
              })
            }
          </Text>
        </div>
      </ModalLayout>
    )
  }
}