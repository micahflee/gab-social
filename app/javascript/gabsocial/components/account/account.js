import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { me } from '../../initial_state'
import Avatar from '../avatar/avatar'
import DisplayName from '../display_name'
import IconButton from '../icon_button'
import Icon from '../icon'

const messages = defineMessages({
  follow: { id: 'account.follow', defaultMessage: 'Follow' },
  unfollow: { id: 'account.unfollow', defaultMessage: 'Unfollow' },
  requested: { id: 'account.requested', defaultMessage: 'Awaiting approval' },
  unblock: { id: 'account.unblock', defaultMessage: 'Unblock @{name}' },
  unmute: { id: 'account.unmute', defaultMessage: 'Unmute @{name}' },
  mute_notifications: { id: 'account.mute_notifications', defaultMessage: 'Mute notifications from @{name}' },
  unmute_notifications: { id: 'account.unmute_notifications', defaultMessage: 'Unmute notifications from @{name}' },
})

export default @injectIntl
class Account extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    onFollow: PropTypes.func.isRequired,
    onBlock: PropTypes.func.isRequired,
    onMute: PropTypes.func.isRequired,
    onMuteNotifications: PropTypes.func,
    intl: PropTypes.object.isRequired,
    hidden: PropTypes.bool,
    actionIcon: PropTypes.string,
    actionTitle: PropTypes.string,
    onActionClick: PropTypes.func,
  }

  handleFollow = () => {
    this.props.onFollow(this.props.account)
  }

  handleBlock = () => {
    this.props.onBlock(this.props.account)
  }

  handleMute = () => {
    this.props.onMute(this.props.account)
  }

  handleMuteNotifications = () => {
    this.props.onMuteNotifications(this.props.account, true)
  }

  handleUnmuteNotifications = () => {
    this.props.onMuteNotifications(this.props.account, false)
  }

  handleAction = () => {
    this.props.onActionClick(this.props.account)
  }

  render() {
    const { account, intl, hidden, onActionClick, actionIcon, actionTitle } = this.props

    if (!account) return null

    if (hidden) {
      return (
        <Fragment>
          {account.get('display_name')}
          {account.get('username')}
        </Fragment>
      )
    }

    let buttons

    if (onActionClick && actionIcon) {
      buttons = <IconButton icon={actionIcon} title={actionTitle} onClick={this.handleAction} />
    } else if (account.get('id') !== me && account.get('relationship', null) !== null) {
      const following = account.getIn(['relationship', 'following'])
      const requested = account.getIn(['relationship', 'requested'])
      const blocking = account.getIn(['relationship', 'blocking'])
      const muting = account.getIn(['relationship', 'muting'])

      if (requested) {
        buttons = <IconButton disabled icon='hourglass' title={intl.formatMessage(messages.requested)} />
      } else if (blocking) {
        buttons = <IconButton active icon='unlock' title={intl.formatMessage(messages.unblock, { name: account.get('username') })} onClick={this.handleBlock} />
      } else if (muting) {
        let hidingNotificationsButton
        if (account.getIn(['relationship', 'muting_notifications'])) {
          hidingNotificationsButton = <IconButton active icon='bell' title={intl.formatMessage(messages.unmute_notifications, { name: account.get('username') })} onClick={this.handleUnmuteNotifications} />
        } else {
          hidingNotificationsButton = <IconButton active icon='bell-slash' title={intl.formatMessage(messages.mute_notifications, { name: account.get('username') })} onClick={this.handleMuteNotifications} />
        }

        buttons = (
          <Fragment>
            <IconButton active icon='volume-up' title={intl.formatMessage(messages.unmute, { name: account.get('username') })} onClick={this.handleMute} />
            {hidingNotificationsButton}
          </Fragment>
        )
      } else if (!account.get('moved') || following) {
        buttons = <IconButton icon={following ? 'user-times' : 'user-plus'} title={intl.formatMessage(following ? messages.unfollow : messages.follow)} onClick={this.handleFollow} active={following} />
      }
    }

    return (
      <div className={[styles.default, styles.marginTop5PX, styles.marginBottom15PX].join(' ')}>
        <div className={[styles.default, styles.flexRow].join(' ')}>

          <NavLink
            className={[styles.default, styles.noUnderline].join(' ')}
            title={account.get('acct')}
            to={`/${account.get('acct')}`}
          >
            <Avatar account={account} size={52} />
          </NavLink>

          <div className={[styles.default, styles.alignItemsStart, styles.paddingHorizontal10PX].join(' ')}>
            <NavLink
              className={[styles.default, styles.noUnderline].join(' ')}
              title={account.get('acct')}
              to={`/${account.get('acct')}`}
            >
              <DisplayName account={account} />
            </NavLink>
            <button className={[styles.default, styles.marginTop5PX, styles.colorBrand, styles.text, styles.cursorPointer, styles.fontSize14PX, styles.circle, styles.border1PX, styles.borderColorBrand, styles.paddingHorizontal20PX, styles.paddingVertical5PX].join(' ')}>
              {intl.formatMessage(messages.follow)}
            </button>
          </div>

          <div className={[styles.default, styles.marginLeftAuto].join(' ')}>
            <button className={[styles.default, styles.circle, styles.backgroundSubtle2, styles.paddingVertical5PX, styles.paddingHorizontal5PX, styles.cursorPointer].join(' ')}>
              <Icon id='close' width='8px' height='8px' />
            </button>
          </div>

        </div>
      </div>
    )
  }

}
