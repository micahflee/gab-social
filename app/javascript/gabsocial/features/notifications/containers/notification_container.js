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
import { boostModal, me } from '../../../initial_state'
import { makeGetNotification, makeGetStatus } from '../../../selectors'
import Notification from '../components/notification/notification-alt'

const makeMapStateToProps = () => {
  const getNotification = makeGetNotification()
  const getStatus = makeGetStatus()

  const mapStateToProps = (state, props) => {
    const notification = getNotification(state, props.notification, props.accountId)

    const account = state.getIn(['accounts', me])

    return {
      accounts: [account, account, account],
      notification: notification,
      status: notification.get('status') ? getStatus(state, { id: notification.get('status') }) : null,
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
    if (status.get('favorited')) {
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
