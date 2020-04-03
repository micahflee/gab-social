import { List as ImmutableList } from 'immutable'
import { openModal } from '../../../actions/modal'
import { mentionCompose } from '../../../actions/compose'
import {
  reblog,
  favorite,
  unreblog,
  unfavorite,
} from '../../../actions/interactions'
import {
  hideStatus,
  revealStatus,
} from '../../../actions/statuses'
import { boostModal } from '../../../initial_state'
import { makeGetNotification } from '../../../selectors'
import Notification from '../components/notification/notification-alt'

const getAccountFromState = (state, accountId) => {
  return state.getIn(['accounts', accountId])
}

const makeMapStateToProps = () => {
  const getNotification = makeGetNotification()

  const mapStateToProps = (state, props) => {
    const isFollows = !!props.notification.get('follow')
    const isLikes = !!props.notification.get('like')
    const isReposts = !!props.notification.get('repost')
    const isGrouped = isFollows || isLikes || isReposts

    if (isFollows) {
      const list = props.notification.get('follow')
      
      let accounts = ImmutableList()
      list.forEach((item) => {
        const account = getAccountFromState(state, item.get('account'))
        accounts = accounts.set(accounts.size, account)
      })
  
      return {
        type: 'follow',
        accounts: accounts, 
        createdAt: undefined,
        statusId: undefined,
      }
    } else if (isLikes || isReposts) {
      const theType = isLikes ? 'like' : 'repost'
      const list = props.notification.get(theType)

      let accounts = ImmutableList()
      const accountIdArr = list.get('accounts')

      for (let i = 0; i < accountIdArr.length; i++) {
        const accountId = accountIdArr[i];
        const account = getAccountFromState(state, accountId)
        accounts = accounts.set(accounts.size, account)
      }

      return {
        type: theType,
        accounts: accounts,
        createdAt: undefined,
        statusId: list.get('status'),
      }
    } else if (!isGrouped) {
      const notification = getNotification(state, props.notification, props.notification.get('account'))
      const account = notification.get('account')
      const statusId = notification.get('status')

      return {
        accounts: !!account ? ImmutableList([account]) : ImmutableList(),
        type: notification.get('type'),
        createdAt: notification.get('created_at'),
        statusId: statusId || undefined,
      }
    }
  }

  return mapStateToProps
}

const mapDispatchToProps = dispatch => ({
  onMention: (account, router) => {
    dispatch(mentionCompose(account, router))
  },

  onModalRepost (status) {
    dispatch(repost(status))
  },

  onRepost (status, e) {
    if (status.get('reblogged')) {
      dispatch(unrepost(status))
    } else {
      if (e.shiftKey || !boostModal) {
        this.onModalRepost(status)
      } else {
        dispatch(openModal('BOOST', { status, onRepost: this.onModalRepost }))
      }
    }
  },

  onFavorite (status) {
    if (status.get('favourited')) {
      dispatch(unfavorite(status))
    } else {
      dispatch(favorite(status))
    }
  },

  onToggleHidden (status) {
    if (status.get('hidden')) {
      dispatch(revealStatus(status.get('id')))
    } else {
      dispatch(hideStatus(status.get('id')))
    }
  },
})

export default connect(makeMapStateToProps, mapDispatchToProps)(Notification)
