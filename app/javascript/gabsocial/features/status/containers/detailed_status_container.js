import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import {
  replyCompose,
  mentionCompose,
} from '../../../actions/compose';
import {
  reblog,
  favorite,
  unreblog,
  unfavorite,
  pin,
  unpin,
} from '../../../actions/interactions';
import { blockAccount } from '../../../actions/accounts';
import {
  muteStatus,
  unmuteStatus,
  deleteStatus,
  hideStatus,
  revealStatus,
} from '../../../actions/statuses';
import { initMuteModal } from '../../../actions/mutes';
import { initReport } from '../../../actions/reports';
import { openModal } from '../../../actions/modal';
// import { showAlertForError } from '../../../actions/alerts';
import { boostModal, deleteModal } from '../../../initial_state';
import { makeGetStatus } from '../../../selectors';
import DetailedStatus from '../components/detailed_status';

const messages = defineMessages({
  deleteConfirm: { id: 'confirmations.delete.confirm', defaultMessage: 'Delete' },
  deleteMessage: { id: 'confirmations.delete.message', defaultMessage: 'Are you sure you want to delete this status?' },
  replyConfirm: { id: 'confirmations.reply.confirm', defaultMessage: 'Reply' },
  replyMessage: { id: 'confirmations.reply.message', defaultMessage: 'Replying now will overwrite the message you are currently composing. Are you sure you want to proceed?' },
  blockAndReport: { id: 'confirmations.block.block_and_report', defaultMessage: 'Block & Report' },
});

const makeMapStateToProps = () => {
  const getStatus = makeGetStatus();

  const mapStateToProps = (state, props) => ({
    status: getStatus(state, props),
    domain: state.getIn(['meta', 'domain']),
  });

  return mapStateToProps;
};

const mapDispatchToProps = (dispatch, { intl }) => ({

  onReply (status, router) {
    dispatch((_, getState) => {
      let state = getState();
      if (state.getIn(['compose', 'text']).trim().length !== 0) {
        dispatch(openModal('CONFIRM', {
          message: intl.formatMessage(messages.replyMessage),
          confirm: intl.formatMessage(messages.replyConfirm),
          onConfirm: () => dispatch(replyCompose(status, router)),
        }));
      } else {
        dispatch(replyCompose(status, router));
      }
    });
  },

  onModalRepost (status) {
    dispatch(repost(status));
  },

  onRepost (status, e) {
    if (status.get('reblogged')) {
      dispatch(unrepost(status));
    } else {
      if (e.shiftKey || !boostModal) {
        this.onModalRepost(status);
      } else {
        dispatch(openModal('BOOST', { status, onRepost: this.onModalRepost }));
      }
    }
  },

  onFavorite (status) {
    if (status.get('favourited')) {
      dispatch(unfavorite(status));
    } else {
      dispatch(favorite(status));
    }
  },

  onPin (status) {
    if (status.get('pinned')) {
      dispatch(unpin(status));
    } else {
      dispatch(pin(status));
    }
  },

  onEmbed (status) {
    // dispatch(openModal('EMBED', {
    //   url: status.get('url'),
    //   onError: error => dispatch(showAlertForError(error)),
    // }));
  },

  onDelete (status, history) {
    if (!deleteModal) {
      dispatch(deleteStatus(status.get('id'), history));
    } else {
      dispatch(openModal('CONFIRM', {
        message: intl.formatMessage(messages.deleteMessage),
        confirm: intl.formatMessage(messages.deleteConfirm),
        onConfirm: () => dispatch(deleteStatus(status.get('id'), history)),
      }));
    }
  },

  onMention (account, router) {
    dispatch(mentionCompose(account, router));
  },

  onOpenMedia (media, index) {
    dispatch(openModal('MEDIA', { media, index }));
  },

  onOpenVideo (media, time) {
    dispatch(openModal('VIDEO', { media, time }));
  },

  onBlock (status) {
    const account = status.get('account')
    dispatch(openModal('BLOCK_ACCOUNT', {
      accountId: account.get('id'),
    }))
  },

  onReport (status) {
    dispatch(initReport(status.get('account'), status));
  },

  onMute (account) {
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
    if (status.get('hidden')) {
      dispatch(revealStatus(status.get('id')));
    } else {
      dispatch(hideStatus(status.get('id')));
    }
  },

});

export default injectIntl(connect(makeMapStateToProps, mapDispatchToProps)(DetailedStatus));
