import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { me } from '../initial_state'
import Avatar from './avatar'
import DisplayName from './display_name'
import Button from './button'
import Text from './text'

const messages = defineMessages({
  follow: { id: 'follow', defaultMessage: 'Follow' },
  unfollow: { id: 'unfollow', defaultMessage: 'Unfollow' },
  requested: { id: 'requested', defaultMessage: 'Requested' },
  unblock: { id: 'unblock', defaultMessage: 'Unblock' },
  unmute: { id: 'unmute', defaultMessage: 'Unmute' },
  mute_notifications: { id: 'account.mute_notifications', defaultMessage: 'Mute notifications from @{name}' },
  unmute_notifications: { id: 'account.unmute_notifications', defaultMessage: 'Unmute notifications from @{name}' },
})

export default
@injectIntl
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
    compact: PropTypes.bool,
    expanded: PropTypes.bool,
    showDismiss: PropTypes.bool,
    dismissAction: PropTypes.func,
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

  handleUnrequest = () => {
    //
  }

  render() {
    const {
      account,
      intl,
      hidden,
      onActionClick,
      actionIcon,
      actionTitle,
      compact,
      expanded,
      dismissAction,
      showDismiss,
    } = this.props

    if (!account) return null

    if (hidden) {
      return (
        <Fragment>
          {account.get('display_name')}
          {account.get('username')}
        </Fragment>
      )
    }

    let buttonOptions
    let buttonText

    if (onActionClick && actionIcon) {
      buttonText = actionTitle
      buttonOptions = {
        onClick: this.handleAction,
        outline: true,
        color: 'brand',
        backgroundColor: 'none',
      }
    } else if (account.get('id') !== me && account.get('relationship', null) !== null) {
      const following = account.getIn(['relationship', 'following'])
      const requested = account.getIn(['relationship', 'requested'])
      const blocking = account.getIn(['relationship', 'blocking'])

      if (requested || blocking) {
        buttonText = intl.formatMessage(requested ? messages.requested : messages.unblock)
        buttonOptions = {
          narrow: true,
          onClick: requested ? this.handleUnrequest : this.handleBlock,
          color: 'primary',
          backgroundColor: 'tertiary',
          className: _s.mt5,
        }
      } else if (!account.get('moved') || following) {
        buttonOptions = {
          narrow: true,
          outline: !following,
          color: !following ? 'brand' : 'white',
          backgroundColor: !following ? 'none' : 'brand',
          className: _s.mt5,
          onClick: this.handleFollow,
        }
        buttonText = intl.formatMessage(following ? messages.unfollow : messages.follow)
      }
    }

    const button = !buttonOptions ? null : (
      <Button {...buttonOptions}>
        <Text color='inherit'>{buttonText}</Text>
      </Button>
    )

    const avatarSize = compact ? 42 : 52
    const dismissBtn = (
      <Button
        narrow
        circle
        backgroundColor='none'
        className={_s.px5}
        onClick={dismissAction}
        icon='close'
        iconWidth='8px'
        iconHeight='8px'
        iconClassName={_s.fillColorSecondary}
      />
    )

    return (
      <div className={[_s.default, _s.mt5, _s.mb15].join(' ')}>
        <div className={[_s.default, _s.flexRow].join(' ')}>

          <NavLink
            className={[_s.default, _s.noUnderline].join(' ')}
            title={account.get('acct')}
            to={`/${account.get('acct')}`}
          >
            <Avatar account={account} size={avatarSize} />
          </NavLink>

          <NavLink
            title={account.get('acct')}
            to={`/${account.get('acct')}`}
            className={[_s.default, _s.alignItemsStart, _s.px10, _s.flexGrow1].join(' ')}
          >
            <DisplayName account={account} multiline={compact} />
            {!compact && button}
          </NavLink>

          <div className={[_s.default].join(' ')}>
            {showDismiss && dismissBtn}
            {compact && button}
          </div>

        </div>
      </div>
    )
  }

}
