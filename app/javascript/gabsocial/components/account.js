import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { me } from '../initial_state'
import {
  followAccount,
  unfollowAccount,
  blockAccount,
  unblockAccount,
  muteAccount,
  unmuteAccount,
} from '../actions/accounts'
import { openModal } from '../actions/modal'
import { initMuteModal } from '../actions/mutes'
import { unfollowModal } from '../initial_state'
import { makeGetAccount } from '../selectors'
import AccountActionButton from './account_action_button'
import Avatar from './avatar'
import DisplayName from './display_name'
import Button from './button'

const makeMapStateToProps = (state, props) => ({
  account: makeGetAccount()(state, props.id),
})

const mapDispatchToProps = (dispatch) => ({

  onFollow (account) {
    if (account.getIn(['relationship', 'following']) || account.getIn(['relationship', 'requested'])) {
      if (unfollowModal) {
        dispatch(openModal('UNFOLLOW', {
          accountId: account.get('id'),
        }))
      } else {
        dispatch(unfollowAccount(account.get('id')))
      }
    } else {
      dispatch(followAccount(account.get('id')))
    }
  },

  onBlock (account) {
    if (account.getIn(['relationship', 'blocking'])) {
      dispatch(unblockAccount(account.get('id')))
    } else {
      dispatch(blockAccount(account.get('id')))
    }
  },

  onMute (account) {
    if (account.getIn(['relationship', 'muting'])) {
      dispatch(unmuteAccount(account.get('id')))
    } else {
      dispatch(initMuteModal(account))
    }
  },


  onMuteNotifications (account, notifications) {
    dispatch(muteAccount(account.get('id'), notifications))
  },
})

export default
@injectIntl
@connect(makeMapStateToProps, mapDispatchToProps)
class Account extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    onFollow: PropTypes.func.isRequired,
    onBlock: PropTypes.func.isRequired,
    onMute: PropTypes.func.isRequired,
    onMuteNotifications: PropTypes.func,
    intl: PropTypes.object.isRequired,
    isHidden: PropTypes.bool,
    actionIcon: PropTypes.string,
    actionTitle: PropTypes.string,
    onActionClick: PropTypes.func,
    compact: PropTypes.bool,
    expanded: PropTypes.bool,
    showDismiss: PropTypes.bool,
    dismissAction: PropTypes.func,
  }

  updateOnProps = [
    'account',
    'isHidden',
    'compact',
    'expanded',
    'showDismiss',
  ]

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
      isHidden,
      onActionClick,
      actionIcon,
      actionTitle,
      compact,
      expanded,
      dismissAction,
      showDismiss,
    } = this.props

    if (!account) return null

    if (isHidden) {
      return (
        <Fragment>
          {account.get('display_name')}
          {`@${account.get('username')}`}
        </Fragment>
      )
    }

    const actionButton = (onActionClick && actionIcon) ? (
      <Button
        onClick={this.handleAction}
        isOutline={true}
        color='brand'
        backgroundColor='none'
      >
        {actionTitle}
      </Button>
    ) :  <AccountActionButton account={account} isSmall />

    const avatarSize = compact ? 42 : 52
    const dismissBtn = !showDismiss ? null : (
      <Button
        isNarrow
        backgroundColor='none'
        className={_s.px5}
        onClick={dismissAction}
        icon='close'
        iconSize='8px'
        iconClassName={_s.fillColorSecondary}
      />
    )

    return (
      <div className={[_s.default, _s.px15, _s.py5, _s.backgroundSubtle_onHover, _s.mb5].join(' ')}>
        <div className={[_s.default, _s.flexRow, _s.alignItemsCenter].join(' ')}>

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
            className={[_s.default, _s.alignItemsStart, _s.noUnderline, _s.px10, _s.flexGrow1].join(' ')}
          >
            <DisplayName account={account} isMultiline={compact} />
            {!compact && actionButton}
          </NavLink>

          <div className={[_s.default].join(' ')}>
            {dismissBtn}
            {compact && actionButton}
          </div>

        </div>
      </div>
    )
  }

}
