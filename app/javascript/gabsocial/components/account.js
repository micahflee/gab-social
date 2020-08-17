import React from 'react'
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
import Text from './text'

const makeMapStateToProps = (state, props) => ({
  account: makeGetAccount()(state, props.id),
})

const mapDispatchToProps = (dispatch) => ({

  onFollow (account) {
    if (account.getIn(['relationship', 'following']) || account.getIn(['relationship', 'requested'])) {
      if (unfollowModal) {
        dispatch(openModal('UNFOLLOW', {
          account,
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
    withBio: PropTypes.bool,
  }

  updateOnProps = [
    'account',
    'isHidden',
    'compact',
    'expanded',
    'showDismiss',
    'withBio',
  ]

  handleAction = (e) => {
    this.props.onActionClick(this.props.account, e)
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
      withBio,
    } = this.props

    if (!account) return null

    if (isHidden) {
      return (
        <React.Fragment>
          {account.get('display_name')}
          {`@${account.get('username')}`}
        </React.Fragment>
      )
    }

    const actionButton = (onActionClick && actionIcon) ? (
      <Button
        onClick={this.handleAction}
        isOutline={true}
        color='brand'
        backgroundColor='none'
        className={[_s.px10, _s.flexRow, _s.alignItemsCenter].join(' ')}
        icon={actionIcon}
        iconSize='10px'
      >
        {
          !!actionTitle &&
          <Text color='inherit' className={_s.ml5}>
            {actionTitle}
          </Text>
        }
      </Button>
    ) :  <AccountActionButton account={account} isSmall />

    const avatarSize = compact ? 42 : 52
    const dismissBtn = !showDismiss ? null : (
      <Button
        isNarrow
        backgroundColor='none'
        className={[_s.alignItemsEnd, _s.px5]}
        onClick={dismissAction}
        icon='close'
        iconSize='8px'
        iconClassName={_s.colorSecondary}
      />
    )

    const content = { __html: account.get('note_emojified') }

    return (
      <div className={[_s.default, _s.px15, _s.py10, _s.borderBottom1PX, _s.borderColorSecondary, _s.bgSubtle_onHover].join(' ')}>
        <div className={[_s.default, _s.flexRow, _s.alignItemsStart].join(' ')}>

          <NavLink
            className={[_s.default, _s.noUnderline].join(' ')}
            title={account.get('acct')}
            to={`/${account.get('acct')}`}
          >
            <Avatar account={account} size={avatarSize} />
          </NavLink>

          <div className={[_s.default, _s.px10, _s.overflowHidden, _s.flexNormal].join(' ')}>
            <div className={[_s.default, _s.flexRow, _s.alignItemsCenter].join(' ')}>
              <NavLink
                title={account.get('acct')}
                to={`/${account.get('acct')}`}
                className={[_s.default, _s.alignItemsStart, _s.pt2, _s.pr5, _s.noUnderline, _s.overflowHidden, _s.flexNormal].join(' ')}
              >
                <DisplayName account={account} isMultiline={compact} />
                {!compact && actionButton}
              </NavLink>

              <div className={[_s.default].join(' ')}>
                {dismissBtn}
                {compact && actionButton}
              </div>
            </div>

            {
              withBio &&
              <div className={[_s.py5, _s.dangerousContent].join(' ')} dangerouslySetInnerHTML={content} />
            }
          </div>
        </div>
      </div>
    )
  }

}
