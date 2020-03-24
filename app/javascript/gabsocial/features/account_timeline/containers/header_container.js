import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { List as ImmutableList } from 'immutable';
import {
  followAccount,
  unfollowAccount,
  blockAccount,
  unblockAccount,
  unmuteAccount,
  pinAccount,
  unpinAccount,
} from '../../../actions/accounts';
import {
  mentionCompose,
} from '../../../actions/compose';
import { initMuteModal } from '../../../actions/mutes';
import { initReport } from '../../../actions/reports';
import { openModal } from '../../../actions/modal';
import { blockDomain, unblockDomain } from '../../../actions/domain_blocks';
import { unfollowModal } from '../../../initial_state';
import { makeGetAccount } from '../../../selectors';
import Header from '../components/header';

const messages = defineMessages({
  unfollowConfirm: { id: 'confirmations.unfollow.confirm', defaultMessage: 'Unfollow' },
  blockDomainConfirm: { id: 'confirmations.domain_block.confirm', defaultMessage: 'Hide entire domain' },
  blockAndReport: { id: 'confirmations.block.block_and_report', defaultMessage: 'Block & Report' },
});

const makeMapStateToProps = () => {
  const getAccount = makeGetAccount();

  const mapStateToProps = (state, { accountId }) => ({
    account: getAccount(state, accountId),
    domain: state.getIn(['meta', 'domain']),
    identity_proofs: state.getIn(['identity_proofs', accountId], ImmutableList()),
  });

  return mapStateToProps;
};

const mapDispatchToProps = (dispatch, { intl }) => ({

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
      dispatch(unblockAccount(account.get('id')));
    } else {
      dispatch(openModal('BLOCK_ACCOUNT', {
        accountId: account.get('id'),
      }));
    }
  },

  onMention (account, router) {
    dispatch(mentionCompose(account, router));
  },
  
  onRepostToggle (account) {
    if (account.getIn(['relationship', 'showing_reblogs'])) {
      dispatch(followAccount(account.get('id'), false));
    } else {
      dispatch(followAccount(account.get('id'), true));
    }
  },

  onEndorseToggle (account) {
    if (account.getIn(['relationship', 'endorsed'])) {
      dispatch(unpinAccount(account.get('id')));
    } else {
      dispatch(pinAccount(account.get('id')));
    }
  },

  onReport (account) {
    dispatch(initReport(account));
  },

  onMute (account) {
    if (account.getIn(['relationship', 'muting'])) {
      dispatch(unmuteAccount(account.get('id')));
    } else {
      dispatch(initMuteModal(account));
    }
  },

  onBlockDomain (domain) {
    dispatch(openModal('BLOCK_DOMAIN', {
      domain,
    }));
  },

  onUnblockDomain (domain) {
    dispatch(unblockDomain(domain));
  },

  onAddToList(account){
    dispatch(openModal('LIST_ADDER', {
      accountId: account.get('id'),
    }));
  },

});

export default injectIntl(connect(makeMapStateToProps, mapDispatchToProps)(Header));
