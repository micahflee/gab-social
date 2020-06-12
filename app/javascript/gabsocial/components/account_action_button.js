import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { injectIntl, defineMessages } from 'react-intl'
import {
  followAccount,
  unfollowAccount,
  unblockAccount,
} from '../actions/accounts'
import { openModal } from '../actions/modal'
import { me, unfollowModal } from '../initial_state'
import Button from './button'
import Text from './text'

// : todo :

const messages = defineMessages({
  follow: { id: 'follow', defaultMessage: 'Follow' },
  following: { id: 'following', defaultMessage: 'Following' },
  unfollow: { id: 'unfollow', defaultMessage: 'Unfollow' },
  requested: { id: 'requested', defaultMessage: 'Requested' },
  unblock: { id: 'unblock', defaultMessage: 'Unblock' },
  blocked: { id: 'account.blocked', defaultMessage: 'Blocked' },
  followers: { id: 'account.followers', defaultMessage: 'Followers' },
  follows: { id: 'account.follows', defaultMessage: 'Follows' },
})

const mapDispatchToProps = (dispatch) => ({

  onFollow(account) {
    if (account.getIn(['relationship', 'following']) || account.getIn(['relationship', 'requested'])) {
      if (unfollowModal) {
        dispatch(openModal('UNFOLLOW', {
          account,
        }));
      } else {
        dispatch(unfollowAccount(account.get('id')));
      }
    } else {
      dispatch(followAccount(account.get('id')));
    }
  },

  onBlock(account) {
    if (account.getIn(['relationship', 'blocking'])) {
      dispatch(unblockAccount(account.get('id')));
    } else {
      dispatch(openModal('BLOCK_ACCOUNT', {
        accountId: account.get('id'),
      }));
    }
  },

});

export default
@injectIntl
@connect(null, mapDispatchToProps)
class AccountActionButton extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    intl: PropTypes.object.isRequired,
    isSmall: PropTypes.bool,
    onBlock: PropTypes.func.isRequired,
    onFollow: PropTypes.func.isRequired,
  }

  updateOnProps = [
    'account',
  ]

  handleFollow = () => {
    this.props.onFollow(this.props.account)
  }

  handleBlock = () => {
    this.props.onBlock(this.props.account)
  }

  render() {
    const {
      account,
      intl,
      isSmall,
    } = this.props

    if (!account) return null

    // Wait until the relationship is loaded
    if (!account.get('relationship')) return null

    // Don't show if is me
    if (account.get('id') === me) return null

    const isBlockedBy = account.getIn(['relationship', 'blocked_by'])

    // Don't show
    if (isBlockedBy) return null

    let buttonText = ''
    let buttonOptions = {}

    const isRequested = account.getIn(['relationship', 'requested'])
    const isBlocking = account.getIn(['relationship', 'blocking'])
    const isFollowing = account.getIn(['relationship', 'following'])

    if (isRequested) {
      buttonText = intl.formatMessage(messages.requested)
      buttonOptions = {
        onClick: this.handleFollow,
        color: 'primary',
        backgroundColor: 'tertiary',
      }
    } else if (isBlocking) {
      buttonText = intl.formatMessage(messages.blocked)
      buttonOptions = {
        onClick: this.handleBlock,
        color: 'white',
        backgroundColor: 'danger',
      }
    } else if (isFollowing) {
      buttonText = intl.formatMessage(messages.following)
      buttonOptions = {
        onClick: this.handleFollow,
        color: 'white',
        backgroundColor: 'brand',
      }
    } else {
      buttonText = intl.formatMessage(messages.follow)
      buttonOptions = {
        onClick: this.handleFollow,
        color: 'brand',
        backgroundColor: 'none',
        isOutline: true,
      }
    }

    const textClassName = isSmall ? null : _s.px10
    const textSize = isSmall ? 'normal' : 'medium'
    const textWeight = isSmall ? 'normal' : 'bold'

    return (
      <Button
        {...buttonOptions}
        isNarrow
        className={[_s.justifyContentCenter, _s.alignItemsCenter].join(' ')}
      >
        <Text
          color='inherit'
          weight={textWeight}
          size={textSize}
          className={textClassName}
        >
          {buttonText}
        </Text>
      </Button>
    )
  }

}