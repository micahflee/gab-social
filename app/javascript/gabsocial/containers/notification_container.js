import { List as ImmutableList } from 'immutable'
import { makeGetNotification } from '../selectors'
import Notification from '../components/notification'

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
    const lastReadId = state.getIn(['notifications', 'lastReadId'])

    if (isFollows) {
      let lastUpdated
      const list = props.notification.get('follow')
      let accounts = ImmutableList()
      list.forEach((item) => {
        const account = getAccountFromState(state, item.get('account'))
        accounts = accounts.set(accounts.size, account)
        if (!lastUpdated) lastUpdated = item.get('created_at')
      })
  
      return {
        type: 'follow',
        accounts: accounts,
        createdAt: lastUpdated,
        isUnread: false,
        statusId: undefined,
      }
    } else if (isLikes || isReposts) {
      const theType = isLikes ? 'like' : 'repost'
      const list = props.notification.get(theType)
      let lastUpdated = list.get('lastUpdated')

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
        createdAt: lastUpdated,
        isUnread: false,
        statusId: list.get('status'),
      }
    } else if (!isGrouped) {
      const notification = getNotification(state, props.notification, props.notification.get('account'))
      const account = notification.get('account')
      const statusId = notification.get('status')

      return {
        type: notification.get('type'),
        accounts: !!account ? ImmutableList([account]) : ImmutableList(),
        createdAt: notification.get('created_at'),
        isUnread: lastReadId < notification.get('id'),
        statusId: statusId || undefined,
      }
    }
  }

  return mapStateToProps
}

export default connect(makeMapStateToProps)(Notification)
