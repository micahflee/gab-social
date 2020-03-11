import { NavLink } from 'react-router-dom'
import { injectIntl, defineMessages } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { HotKeys } from 'react-hotkeys'
import ImmutablePropTypes from 'react-immutable-proptypes'
import StatusContainer from '../../../../containers/status_container'
import AccountContainer from '../../../../containers/account_container'
import Avatar from '../../../../components/avatar'
import Icon from '../../../../components/icon'
import Text from '../../../../components/text'
import DisplayName from '../../../../components/display_name'

const messages = defineMessages({

})

const notificationForScreenReader = (intl, message, timestamp) => {
  const output = [message]

  output.push(intl.formatDate(timestamp, { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }))

  return output.join(', ')
}

export default
@injectIntl
class Notification extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    status: ImmutablePropTypes.map,
    intl: PropTypes.object.isRequired,
    notificationType: PropTypes.string.isRequired,
    accounts: ImmutablePropTypes.list,
  }

  renderFavorite = () => {
    const { status, notificationType, accounts } = this.props

    return (
      <div className={[_s.default, _s.px10].join(' ')}>
        <div className={[_s.default, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
          <div className={[_s.default, _s.flexRow, _s.my10, _s.py10, _s.px10].join(' ')}>

            <Icon id='apps' height='20px' width='20px' className={_s.mt5} />

            <div className={[_s.default, _s.ml15].join(' ')}>
              <div className={[_s.default, _s.flexRow].join(' ')}>
                {
                  accounts.slice(0, 6).map((account, i) => (
                    <NavLink
                      to={`/${account.get('acct')}`}
                      key={`fav-avatar-${i}`}
                      className={_s.mr5}
                    >
                      <Avatar size='30' account={account} />
                    </NavLink>
                  ))
                }
              </div>
              <div className={[_s.default, _s.pt10].join(' ')}>
                <div className={[_s.default, _s.flexRow].join(' ')}>
                  <div className={_s.text}>
                    {
                      accounts.slice(0, 1).map((account, i) => (
                        <DisplayName key={i} account={account} noUsername />
                      ))
                    }
                  </div>
                  <Text size='medium'>
                    &nbsp;and 3 others favorited your gab
                  </Text>
                </div>
              </div>

              <div className={[_s.default, _s.pt10].join(' ')}>
                <Text color='secondary' size='medium'>
                  post this at 1-14-2020 12:15pm (edited)
                </Text>
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }

  render() {
    const {
      status,
      notificationType,
      accounts,
      intl
    } = this.props

    // const linkTo = '/admin/posts/123/reblogs' // etc.

    return (
      <NavLink
        to={`/`}
        className={[_s.default, _s.px10, _s.backgroundSubtle_onHover].join(' ')}
      >
        <div className={[_s.default, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
          <div className={[_s.default, _s.flexRow, _s.my10, _s.py10, _s.px10].join(' ')}>

            <Icon id='apps' height='20px' width='20px' className={_s.mt5} />

            <div className={[_s.default, _s.ml15].join(' ')}>
              <div className={[_s.default, _s.flexRow].join(' ')}>
                {
                  accounts.slice(0, 6).map((account, i) => (
                    <NavLink
                      to={`/${account.get('acct')}`}
                      key={`fav-avatar-${i}`}
                      className={_s.mr5}
                    >
                      <Avatar size='30' account={account} />
                    </NavLink>
                  ))
                }
              </div>
              <div className={[_s.default, _s.pt10].join(' ')}>
                <div className={[_s.default, _s.flexRow].join(' ')}>
                  <div className={_s.text}>
                    {
                      accounts.slice(0, 1).map((account, i) => (
                        <DisplayName key={i} account={account} noUsername />
                      ))
                    }
                  </div>
                  <Text size='medium'>
                    &nbsp;and 3 others favorited your gab
                  </Text>
                </div>
              </div>

              <div className={[_s.default, _s.pt10].join(' ')}>
                <Text color='secondary' size='medium'>
                  post this at 1-14-2020 12:15pm (edited)
                </Text>
              </div>
            </div>

          </div>
        </div>
      </NavLink>
    )
  }

}
