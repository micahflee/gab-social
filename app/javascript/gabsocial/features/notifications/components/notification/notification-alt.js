import { injectIntl, FormattedMessage } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { HotKeys } from 'react-hotkeys'
import ImmutablePropTypes from 'react-immutable-proptypes'
import StatusContainer from '../../../../containers/status_container'
import AccountContainer from '../../../../containers/account_container'
import Button from '../../../../components/button'
import Icon from '../../../../components/icon'

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

  }

  render() {
    const { notification } = this.props
    const account = notification.get('account')

    switch (notification.get('type')) {
      case 'favourite':
        return this.renderFavorite()
    }

    return null
  }

}
