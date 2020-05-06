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
    onClose: PropTypes.func.isRequired,
  }

  render() {
    const { intl, onClose } = this.props

    return (
      <ModalLayout
        title={intl.formatMessage(messages.signup)}
        onClose={onClose}
        width={400}
      >
        <div className={[_s.default, _s.px10, _s.py10].join(' ')}>
          <Text className={_s.mb15} align='center'>
            {intl.formatMessage(messages.text)}
          </Text>
          <Button isBlock href='/auth/sign_up' className={[_s.mr15, _s.ml15, _s.mlAuto, _s.mrAuto].join(' ')}>
            {intl.formatMessage(messages.register)}
          </Button>
        </div>
        <div className={[_s.default, _s.px10, _s.py5].join(' ')}>
          <Text color='secondary' size='small' align='center'>
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