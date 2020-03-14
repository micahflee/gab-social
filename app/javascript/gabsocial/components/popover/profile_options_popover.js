import { defineMessages, injectIntl, FormattedMessage } from 'react-intl'
import {
  followAccount,
  unfollowAccount,
  blockAccount,
  unblockAccount,
  unmuteAccount,
  pinAccount,
  unpinAccount,
} from '../../actions/accounts'
import {
  mentionCompose,
} from '../../actions/compose'
import { initMuteModal } from '../../actions/mutes'
import { initReport } from '../../actions/reports'
import { openModal } from '../../actions/modal'
import { blockDomain, unblockDomain } from '../../actions/domain_blocks'
import { unfollowModal, autoPlayGif, me, isStaff } from '../../initial_state'
import { makeGetAccount } from '../../selectors'
import PopoverLayout from './popover_layout'
import Text from '../text'
import List from '../list'

const messages = defineMessages({
  unfollowConfirm: { id: 'confirmations.unfollow.confirm', defaultMessage: 'Unfollow' },
  blockConfirm: { id: 'confirmations.block.confirm', defaultMessage: 'Block' },
  blockDomainConfirm: { id: 'confirmations.domain_block.confirm', defaultMessage: 'Hide entire domain' },
  blockAndReport: { id: 'confirmations.block.block_and_report', defaultMessage: 'Block & Report' },
  unfollow: { id: 'account.unfollow', defaultMessage: 'Unfollow' },
  follow: { id: 'account.follow', defaultMessage: 'Follow' },
  requested: { id: 'account.requested', defaultMessage: 'Awaiting approval. Click to cancel follow request' },
  unblock: { id: 'account.unblock', defaultMessage: 'Unblock @{name}' },
  edit_profile: { id: 'account.edit_profile', defaultMessage: 'Edit profile' },
  linkVerifiedOn: { id: 'account.link_verified_on', defaultMessage: 'Ownership of this link was checked on {date}' },
  account_locked: { id: 'account.locked_info', defaultMessage: 'This account privacy status is set to locked. The owner manually reviews who can follow them.' },
  mention: { id: 'account.mention', defaultMessage: 'Mention' },
  unmute: { id: 'account.unmute', defaultMessage: 'Unmute @{name}' },
  block: { id: 'account.block', defaultMessage: 'Block @{name}' },
  mute: { id: 'account.mute', defaultMessage: 'Mute @{name}' },
  report: { id: 'account.report', defaultMessage: 'Report @{name}' },
  share: { id: 'account.share', defaultMessage: 'Share @{name}\'s profile' },
  media: { id: 'account.media', defaultMessage: 'Media' },
  blockDomain: { id: 'account.block_domain', defaultMessage: 'Hide everything from {domain}' },
  unblockDomain: { id: 'account.unblock_domain', defaultMessage: 'Unhide {domain}' },
  hideReposts: { id: 'account.hide_reblogs', defaultMessage: 'Hide reposts from @{name}' },
  showReposts: { id: 'account.show_reblogs', defaultMessage: 'Show reposts from @{name}' },
  preferences: { id: 'navigation_bar.preferences', defaultMessage: 'Preferences' },
  follow_requests: { id: 'navigation_bar.follow_requests', defaultMessage: 'Follow requests' },
  blocks: { id: 'navigation_bar.blocks', defaultMessage: 'Blocked users' },
  domain_blocks: { id: 'navigation_bar.domain_blocks', defaultMessage: 'Hidden domains' },
  mutes: { id: 'navigation_bar.mutes', defaultMessage: 'Muted users' },
  endorse: { id: 'account.endorse', defaultMessage: 'Feature on profile' },
  unendorse: { id: 'account.unendorse', defaultMessage: 'Don\'t feature on profile' },
  admin_account: { id: 'status.admin_account', defaultMessage: 'Open moderation interface for @{name}' },
  add_or_remove_from_list: { id: 'account.add_or_remove_from_list', defaultMessage: 'Add or Remove from lists' },
  accountFollowsYou: { id: 'account.follows_you', defaultMessage: 'Follows you' },
  accountBlocked: { id: 'account.blocked', defaultMessage: 'Blocked' },
  accountMuted: { id: 'account.muted', defaultMessage: 'Muted' },
  domainBlocked: { id: 'account.domain_blocked', defaultMessage: 'Domain hidden' },
});

const makeMapStateToProps = () => {
  const getAccount = makeGetAccount();

  const mapStateToProps = (state, { account }) => ({
    account: getAccount(state, !!account ? account.get('id') : -1),
    domain: state.getIn(['meta', 'domain']),
  });

  return mapStateToProps;
};

const mapDispatchToProps = (dispatch, { intl }) => ({

  onFollow (account) {
    if (account.getIn(['relationship', 'following']) || account.getIn(['relationship', 'requested'])) {
      if (unfollowModal) {
        dispatch(openModal('CONFIRM', {
          message: <FormattedMessage id='confirmations.unfollow.message' defaultMessage='Are you sure you want to unfollow {name}?' values={{ name: <strong>@{account.get('acct')}</strong> }} />,
          confirm: intl.formatMessage(messages.unfollowConfirm),
          onConfirm: () => dispatch(unfollowAccount(account.get('id'))),
        }));
      } else {
        dispatch(unfollowAccount(account.get('id')));
      }
    } else {
      dispatch(followAccount(account.get('id')));
    }
  },

  onBlock (account) {
    if (account.getIn(['relationship', 'blocking'])) {
      dispatch(unblockAccount(account.get('id')));
    } else {
      dispatch(openModal('CONFIRM', {
        message: <FormattedMessage id='confirmations.block.message' defaultMessage='Are you sure you want to block {name}?' values={{ name: <strong>@{account.get('acct')}</strong> }} />,
        confirm: intl.formatMessage(messages.blockConfirm),
        onConfirm: () => dispatch(blockAccount(account.get('id'))),
        secondary: intl.formatMessage(messages.blockAndReport),
        onSecondary: () => {
          dispatch(blockAccount(account.get('id')));
          dispatch(initReport(account));
        },
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
    dispatch(openModal('CONFIRM', {
      message: <FormattedMessage id='confirmations.domain_block.message' defaultMessage='Are you really, really sure you want to block the entire {domain}? In most cases a few targeted blocks or mutes are sufficient and preferable. You will not see content from that domain in any public timelines or your notifications. Your followers from that domain will be removed.' values={{ domain: <strong>{domain}</strong> }} />,
      confirm: intl.formatMessage(messages.blockDomainConfirm),
      onConfirm: () => dispatch(blockDomain(domain)),
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


export default
@injectIntl
@connect(makeMapStateToProps, mapDispatchToProps)
class ProfileOptionsPopover extends PureComponent {

  makeMenu() {
    const { account, intl, domain } = this.props;

    let menu = [];

    if (!account) {
      return [];
    }

    if ('share' in navigator) {
      menu.push({ title: intl.formatMessage(messages.share, { name: account.get('username') }), onClick: this.handleShare });
    }

    if (account.get('id') === me) {
      menu.push({ title: intl.formatMessage(messages.edit_profile), href: '/settings/profile' });
      menu.push({ title: intl.formatMessage(messages.preferences), href: '/settings/preferences' });
      menu.push({ title: intl.formatMessage(messages.follow_requests), to: '/follow_requests' });
      menu.push({ title: intl.formatMessage(messages.mutes), to: '/mutes' });
      menu.push({ title: intl.formatMessage(messages.blocks), to: '/blocks' });
      menu.push({ title: intl.formatMessage(messages.domain_blocks), to: '/domain_blocks' });
    } else {
      menu.push({ title: intl.formatMessage(messages.mention, { name: account.get('acct') }), onClick: this.props.onMention });

      if (account.getIn(['relationship', 'following'])) {
        if (account.getIn(['relationship', 'showing_reblogs'])) {
          menu.push({ title: intl.formatMessage(messages.hideReposts, { name: account.get('username') }), onClick: this.props.onRepostToggle });
        } else {
          menu.push({ title: intl.formatMessage(messages.showReposts, { name: account.get('username') }), onClick: this.props.onRepostToggle });
        }

        menu.push({ title: intl.formatMessage(messages.add_or_remove_from_list), onClick: this.props.onAddToList });
        menu.push({ title: intl.formatMessage(account.getIn(['relationship', 'endorsed']) ? messages.unendorse : messages.endorse), onClick: this.props.onEndorseToggle });
      }

      if (account.getIn(['relationship', 'muting'])) {
        menu.push({ title: intl.formatMessage(messages.unmute, { name: account.get('username') }), onClick: this.props.onMute });
      } else {
        menu.push({ title: intl.formatMessage(messages.mute, { name: account.get('username') }), onClick: this.props.onMute });
      }

      if (account.getIn(['relationship', 'blocking'])) {
        menu.push({ title: intl.formatMessage(messages.unblock, { name: account.get('username') }), onClick: this.props.onBlock });
      } else {
        menu.push({ title: intl.formatMessage(messages.block, { name: account.get('username') }), onClick: this.props.onBlock });
      }

      menu.push({ title: intl.formatMessage(messages.report, { name: account.get('username') }), onClick: this.props.onReport });
    }

    if (account.get('acct') !== account.get('username')) {
      const domain = account.get('acct').split('@')[1];

      if (account.getIn(['relationship', 'domain_blocking'])) {
        menu.push({ title: intl.formatMessage(messages.unblockDomain, { domain }), onClick: this.props.onUnblockDomain });
      } else {
        menu.push({ title: intl.formatMessage(messages.blockDomain, { domain }), onClick: this.props.onBlockDomain });
      }
    }

    if (account.get('id') !== me && isStaff) {
      menu.push({ title: intl.formatMessage(messages.admin_account, { name: account.get('username') }), href: `/admin/accounts/${account.get('id')}` });
    }

    return menu;
  }


  render() {
    const listItems = this.makeMenu()

    return (
      <PopoverLayout>
        <List
          scrollKey='profile_options'
          items={listItems}
          small
        />
      </PopoverLayout>
    )
  }
}