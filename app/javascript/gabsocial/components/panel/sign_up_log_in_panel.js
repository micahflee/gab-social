import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, defineMessages } from 'react-intl'
import { me } from '../../initial_state'
import { CX } from '../../constants'
import Button from '../button'
import Text from '../text'

const messages = defineMessages({
  title: { id: 'signup_panel.welcome_title', defaultMessage: 'Welcome to Gab.com' },
  subtitle: { id: 'signup_panel.welcome_subtitle', defaultMessage: 'A social network that champions free speech, individual liberty and the free flow of information online. All are welcome.' },
  register: { id: 'account.register', defaultMessage: 'Sign up' },
  login: { id: 'account.login', defaultMessage: 'Log in' },
})

export default
@injectIntl
class SignUpLogInPanel extends React.PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    isXS: PropTypes.bool,
  }

  render() {
    const { intl, isXS } = this.props

    if (me) return null

    const containerClasses = CX({
      default: 1,
      radiusSmall: 1,
      overflowHidden: 1,
      bgPrimary: 1,
      boxShadowBlock: 1,
      py15: 1,
      justifyContentCenter: 1,
      heigh315PX: !isXS,
      height158PX: isXS,
    })

    return (
      <aside className={[_s.default, _s.mb15].join(' ')}>
        <div className={containerClasses}>
          <div className={[_s.default]}>
            <div className={[_s.default, _s.px15, _s.py10].join(' ')}>
              <div className={[_s.default].join(' ')}>
                <Text color='primary' size='extraExtraLarge' weight='bold' align='center' tag='h2'>
                  {intl.formatMessage(messages.title)}
                </Text>
              </div>
              <Text color='secondary' className={_s.mt5} align='center' tag='h3'>
                {intl.formatMessage(messages.subtitle)}
              </Text>
            </div>
          </div>

          {
            !isXS &&
            <div className={[_s.default, _s.px15, _s.py10].join(' ')}>
              <div className={[_s.default, _s.pb5].join(' ')}>
                <Button
                  isOutline
                  color='white'
                  href='/auth/sign_in'
                  className={[_s.mb10, _s.borderColorWhite].join(' ')}
                >
                  <Text color='inherit' size='large' weight='bold' align='center'>
                    {intl.formatMessage(messages.login)}
                  </Text>
                </Button>
                <Button
                  isOutline
                  color='brand'
                  backgroundColor='white'
                  href='/auth/sign_up'
                >
                  <Text color='inherit' size='large' weight='bold' align='center'>
                    {intl.formatMessage(messages.register)}
                  </Text>
                </Button>
              </div>
            </div>
          }
        </div>
      </aside>
    )
  }

}
