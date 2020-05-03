import { FormattedMessage } from 'react-intl'
import { Map as ImmutableMap, List as ImmutableList } from 'immutable';
import {
  replyCompose,
  mentionCompose,
  quoteCompose,
} from '../actions/compose';
import {
  repost,
  favorite,
  unrepost,
  unfavorite,
  pin,
  unpin,
} from '../actions/interactions';
import {
  muteStatus,
  unmuteStatus,
  deleteStatus,
  editStatus,
  hideStatus,
  revealStatus,
  fetchComments,
} from '../actions/statuses';
import { initMuteModal } from '../actions/mutes';
import { initReport } from '../actions/reports';
import { openModal } from '../actions/modal';
import { openPopover } from '../actions/popover';
import { me, boostModal, deleteModal } from '../initial_state';
import {
  createRemovedAccount,
  groupRemoveStatus,
} from '../actions/groups';
import { makeGetStatus } from '../selectors';
import Status from '../components/status';

const makeMapStateToProps = () => {
  const getStatus = makeGetStatus()

  const mapStateToProps = (state, props) => {
    const statusId = props.id || props.params.statusId
    const username = props.params ? props.params.username : undefined

    const status = getStatus(state, {
      id: statusId,
      username: username,
    })

    // : todo : if is comment (i.e. if any ancestorsIds) use comment not status

    let descendantsIds = ImmutableList()

    if (status) {
      let indent = -1
      descendantsIds = descendantsIds.withMutations(mutable => {
        const ids = [status.get('id')]

        const r = state.getIn(['contexts', 'replies', ids[0]])
        // console.log("r:", r)

        while (ids.length > 0) {
          let id = ids.shift()
          const replies = state.getIn(['contexts', 'replies', id])

          if (status.get('id') !== id) {
            mutable.push(ImmutableMap({
              statusId: id,
              indent: indent,
            }))
          }

          if (replies) {
            replies.reverse().forEach(reply => {
              ids.unshift(reply)
            });
            indent++
            indent = Math.min(2, indent)
          }
        }
      })
    }

    return {
      status,
      descendantsIds
    }
  }

  return mapStateToProps
};

const mapDispatchToProps = (dispatch) => ({
  onReply (status, router, showModal) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))

    dispatch((_, getState) => {
      const state = getState();
      if (state.getIn(['compose', 'text']).trim().length !== 0) {
        dispatch(openModal('CONFIRM', {
          message: <FormattedMessage id='confirmations.reply.message' defaultMessage='Replying now will overwrite the message you are currently composing. Are you sure you want to proceed?' />,
          confirm: <FormattedMessage id='confirmations.reply.confirm' defaultMessage='Reply' />,
          onConfirm: () => dispatch(replyCompose(status, router)),
        }))
      } else {
        dispatch(replyCompose(status, router, showModal));
      }
    })
  },

  onRepost (targetRef, status, e) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))
    
    if (e.shiftKey) {
      this.onModalRepost(status);
    } else {
      dispatch(openPopover('REPOST_OPTIONS', {
        status,
        targetRef,
        position: 'top',
      }))
    }
  },

  onModalRepost (status) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))

    if (status.get('reblogged')) {
      dispatch(unrepost(status));
    } else {
      dispatch(repost(status));
    }
  },

  onShare(targetRef, status) {
    dispatch(openPopover('STATUS_SHARE', {
      status,
      targetRef,
      position: 'top',
    }))
  },

  onShowRevisions (status) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))

    dispatch(openModal('STATUS_REVISION', { status }));
  },

  onFavorite (status) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))

    if (status.get('favourited')) {
      dispatch(unfavorite(status));
    } else {
      dispatch(favorite(status));
    }
  },

  onPin (status) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))

    if (status.get('pinned')) {
      dispatch(unpin(status));
    } else {
      dispatch(pin(status));
    }
  },

  onDelete (status, history) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))
    
    if (!deleteModal) {
      dispatch(deleteStatus(status.get('id'), history));
    } else {
      dispatch(openModal('CONFIRM', {
        message: <FormattedMessage id='confirmations.delete.message' defaultMessage='Are you sure you want to delete this status?' />,
        confirm: <FormattedMessage id='confirmations.delete.confirm' defaultMessage='Delete' />,
        onConfirm: () => dispatch(deleteStatus(status.get('id'), history)),
      }));
    }
  },

  onEdit (status) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))

    dispatch(editStatus(status));
  },

  onMention (account, router) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))

    dispatch(mentionCompose(account, router));
  },

  onOpenMedia (media, index) {
    dispatch(openModal('MEDIA', { media, index }));
  },

  onOpenVideo (media, time) {
    dispatch(openModal('VIDEO', { media, time }));
  },

  onBlock (status) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))

    const account = status.get('account')
    dispatch(openModal('BLOCK_ACCOUNT', {
      accountId: account.get('id'),
    }))
  },

  onReport (status) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))

    dispatch(initReport(status.get('account'), status));
  },

  onMute (account) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))

    dispatch(initMuteModal(account));
  },

  onMuteConversation (status) {
    if (status.get('muted')) {
      dispatch(unmuteStatus(status.get('id')));
    } else {
      dispatch(muteStatus(status.get('id')));
    }
  },

  onToggleHidden (status) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))

    if (status.get('hidden')) {
      dispatch(revealStatus(status.get('id')));
    } else {
      dispatch(hideStatus(status.get('id')));
    }
  },

  onGroupRemoveAccount(groupId, accountId) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))

    dispatch(createRemovedAccount(groupId, accountId));
  },

  onGroupRemoveStatus(groupId, statusId) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))

    dispatch(groupRemoveStatus(groupId, statusId));
  },

  onFetchComments(statusId) {
    dispatch(fetchComments(statusId))
  },

  onOpenLikes(status) {
    dispatch(openModal('STATUS_LIKES', { status }))
  },
    
  onOpenReposts(status) {
    dispatch(openModal('STATUS_REPOSTS', { status }))
  },

});

export default connect(makeMapStateToProps, mapDispatchToProps)(Status);
