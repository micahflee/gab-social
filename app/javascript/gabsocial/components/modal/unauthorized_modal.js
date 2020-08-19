import React from 'react'
import PropTypes from 'prop-types'
import { defineMessages, injectIntl } from 'react-intl'
import ModalLayout from './modal_layout'
import Text from '../text'
import Button from '../button'

class UnauthorizedModal extends React.PureComponent {

  render() {
    const { intl, onClose } = this.props

    return (
      <ModalLayout
        hideClose
        title={intl.formatMessage(messages.signup)}
        onClose={onClose}
        width={480}
      >
        <div className={[_s.d, _s.mt15, _s.mb15, _s.px15, _s.pb15].join(' ')}>
          <div className={[_s.d, _s.px15, _s.py15].join(' ')}>
            <Text className={[_s.px15, _s.py15, _s.mb15]} size='medium' weight='medium' align='center'>
              {intl.formatMessage(messages.text)}
            </Text>

            <Button isBlock href='/auth/sign_up' className={[_s.mt15, _s.mlAuto, _s.mrAuto].join(' ')}>
              <Text color='inherit' size='large' weight='bold' align='center'>
                {intl.formatMessage(messages.register)}
              </Text>
            </Button>

            <Button
              isOutline
              isBlock
              href='/auth/sign_in'
              color='brand'
              backgroundColor='none'
              className={[_s.mt15, _s.mlAuto, _s.mrAuto].join(' ')}
            >
              <Text color='inherit' size='large' weight='bold' align='center'>
                {intl.formatMessage(messages.login)}
              </Text>
            </Button>
          </div>
        </div>
      </ModalLayout>
    )
  }

}

const messages = defineMessages({
  signup: { id: 'unauthorized_modal.title', defaultMessage: 'Sign up for Gab' },
  text: { id: 'unauthorized_modal.text', defaultMessage: 'You need to be logged in to do that.' },
  register: { id: 'account.register', defaultMessage: 'Sign up' },
  login: { id: 'account.login', defaultMessage: 'Log in' },
})

UnauthorizedModal.propTypes = {
  intl: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default injectIntl(UnauthorizedModal)