import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { me } from '../initial_state'
import { CX } from '../constants'
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

class Account extends ImmutablePureComponent {

  handleAction = (e) => {
    this.props.onActionClick(this.props.account, e)
    e.preventDefault()
    return false
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
      isCard,
      noClick,
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

    const actionButton = (onActionClick && (actionIcon || actionTitle)) ? (
      <Button
        onClick={this.handleAction}
        isOutline={true}
        color='brand'
        backgroundColor='none'
        className={[_s.px10, _s.flexRow, _s.aiCenter, _s.ml15].join(' ')}
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

    const avatarSize = compact ? 40 : 52
    const dismissBtn = !showDismiss ? null : (
      <Button
        isNarrow
        backgroundColor='none'
        className={[_s.aiEnd, _s.px5]}
        onClick={dismissAction}
        icon='close'
        iconSize='8px'
        iconClassName={_s.cSecondary}
      />
    )

    const content = { __html: account.get('note_emojified') }

    const buttonClasses = CX({
      d: 1,
      pt2: 1,
      pr5: 1,
      noUnderline: 1,
      overflowHidden: 1,
      flexNormal: 1,
      outlineNone: 1,
      bgTransparent: 1,
      aiStart: !isCard,
      aiCenter: isCard,
    })

    const containerClasses = CX({
      d: 1,
      px15: 1,
      py10: 1,
      bgSubtle_onHover: 1,
      borderBottom1PX: !isCard,
      borderColorSecondary: !isCard,
    })

    const innerContainerClasses = CX({
      d: 1,
      flexRow: !isCard,
      aiStart: !isCard,
      aiCenter: isCard,
    })

    const displayNameWrapperClasses = CX({
      py10: isCard,
    })

    return (
      <div className={containerClasses}>
        <div className={innerContainerClasses}>

          <Button
            noClasses
            className={[_s.d, _s.noUnderline, _s.outlineNone, _s.bgTransparent].join(' ')}
            title={account.get('acct')}
            to={noClick ? undefined : `/${account.get('acct')}`}
          >
            <Avatar account={account} size={avatarSize} />
          </Button>

          <div className={[_s.d, _s.px10, _s.overflowHidden, _s.flexNormal].join(' ')}>
            <div className={[_s.d, _s.flexRow, _s.aiCenter].join(' ')}>
              <Button
                noClasses
                title={account.get('acct')}
                to={noClick ? undefined : `/${account.get('acct')}`}
                className={buttonClasses}
              >
                <div className={displayNameWrapperClasses}>
                  <DisplayName account={account} isMultiline={compact || isCard} />
                </div>
                {!compact && actionButton}
              </Button>

              <div className={[_s.d, _s.flexRow, _s.aiCenter].join(' ')}>
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

Account.propTypes = {
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
  isCard: PropTypes.bool,
  noClick: PropTypes.bool,
}

export default injectIntl(connect(makeMapStateToProps, mapDispatchToProps)(Account))