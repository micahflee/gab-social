import { defineMessages, injectIntl } from 'react-intl'
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
import { muteAccount } from '../../actions/accounts'
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
  blocks: { id: 'navigation_bar.blocks', defaultMessage: 'Blocked users' },
  domain_blocks: { id: 'navigation_bar.domain_blocks', defaultMessage: 'Hidden domains' },
  mutes: { id: 'navigation_bar.mutes', defaultMessage: 'Muted users' },
  admin_account: { id: 'admin_account', defaultMessage: 'Open moderation interface' },
  add_or_remove_from_list: { id: 'account.add_or_remove_from_list', defaultMessage: 'Add or Remove from lists' },
  add_or_remove_from_shortcuts: { id: 'account.add_or_remove_from_shortcuts', defaultMessage: 'Add or Remove from shortcuts' },
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

  onFollow(account) {
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

  onBlock(account) {
    if (account.getIn(['relationship', 'blocking'])) {
      dispatch(unblockAccount(account.get('id')));
    } else {
      dispatch(openModal('BLOCK_ACCOUNT', {
        accountId: account.get('id'),
      }));
    }
  },

  onMention(account) {
    dispatch(mentionCompose(account));
  },

  onRepostToggle(account) {
    if (account.getIn(['relationship', 'showing_reblogs'])) {
      dispatch(followAccount(account.get('id'), false));
    } else {
      dispatch(followAccount(account.get('id'), true));
    }
  },

  onReport(account) {
    dispatch(initReport(account));
  },

  onMute(account) {
    if (account.getIn(['relationship', 'muting'])) {
      dispatch(unmuteAccount(account.get('id')));
    } else {
      dispatch(openModal('MUTE', {
        accountId: account.get('id'),
      }))
    }
  },

  onBlockDomain(domain) {
    dispatch(openModal('BLOCK_DOMAIN', {
      domain,
    }));
  },

  onUnblockDomain(domain) {
    dispatch(unblockDomain(domain));
  },

  onAddToList(account) {
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

    if (!account) return menu
    if (account.get('id') === me) return menu

    if ('share' in navigator) {
      menu.push({
        hideArrow: true,
        icon: 'share',
        title: intl.formatMessage(messages.share, { name: account.get('username') }),
        onClick: this.handleShare
      });
    }

    menu.push({
      hideArrow: true,
      icon: 'comment',
      title: intl.formatMessage(messages.mention, { name: account.get('acct') }),
      onClick: this.handleOnMention
    });

    if (account.getIn(['relationship', 'following'])) {
      const showingReblogs = account.getIn(['relationship', 'showing_reblogs'])
      menu.push({
        hideArrow: true,
        icon: 'repost',
        title: intl.formatMessage(showingReblogs ? messages.hideReposts : messages.showReposts, {
          name: account.get('username')
        }),
        onClick: this.handleRepostToggle,
      })
    }

    const isMuting = account.getIn(['relationship', 'muting'])
    menu.push({
      hideArrow: true,
      icon: 'audio-mute',
      title: intl.formatMessage(isMuting ? messages.unmute : messages.mute, {
        name: account.get('username')
      }),
      onClick: this.handleMute,
    })

    const isBlocking = account.getIn(['relationship', 'blocking'])
    menu.push({
      hideArrow: true,
      icon: 'block',
      title: intl.formatMessage(isBlocking ? messages.unblock : messages.block, {
        name: account.get('username')
      }),
      onClick: this.handleBlock
    })

    menu.push({
      hideArrow: true,
      icon: 'report',
      title: intl.formatMessage(messages.report, { name: account.get('username') }),
      onClick: this.handleReport
    })

    if (account.get('acct') !== account.get('username')) {
      const domain = account.get('acct').split('@')[1];

      const isBlockingDomain = account.getIn(['relationship', 'domain_blocking'])
      menu.push({
        hideArrow: true,
        icon: 'block',
        title: intl.formatMessage(isBlockingDomain ? messages.unblockDomain : messages.blockDomain, {
          domain,
        }),
        onClick: isBlockingDomain ? this.handleUnblockDomain : this.handleBlockDomain,
      })
    }

    menu.push({
      hideArrow: true,
      icon: 'list',
      title: intl.formatMessage(messages.add_or_remove_from_list),
      onClick: this.handleAddToList
    })

    menu.push({
      hideArrow: true,
      icon: 'circle',
      title: intl.formatMessage(messages.add_or_remove_from_shortcuts),
      onClick: this.handleAddToShortcuts
    })

    if (isStaff) {
      menu.push({
        hideArrow: true,
        icon: 'circle',
        title: intl.formatMessage(messages.admin_account),
        href: `/admin/accounts/${account.get('id')}`
      })
    }

    return menu
  }

  handleShare = () => {
    // : todo :
  }

  handleFollow = () => {
    this.props.onFollow(this.props.account);
  }

  handleBlock = () => {
    this.props.onBlock(this.props.account);
  }

  handleOnMention = () => {
    this.props.onMention(this.props.account);
  }

  handleReport = () => {
    this.props.onReport(this.props.account);
  }

  handleRepostToggle = () => {
    this.props.onRepostToggle(this.props.account);
  }

  handleMute = () => {
    this.props.onMute(this.props.account);
  }

  handleBlockDomain = () => {
    const domain = this.props.account.get('acct').split('@')[1]

    console.log("handleBlockDomain:", domain)

    // : todo : alert
    if (!domain) return

    this.props.onBlockDomain(domain)
  }

  handleUnblockDomain = () => {
    const domain = this.props.account.get('acct').split('@')[1];

    // : todo : alert
    if (!domain) return;

    this.props.onUnblockDomain(domain);
  }

  handleAddToList = () => {
    this.props.onAddToList(this.props.account);
  }

  handleAddToShortcuts = () => {
    // : todo :
  }

  render() {
    const listItems = this.makeMenu()

    return (
      <PopoverLayout className={_s.width250PX}>
        <List
          scrollKey='profile_options'
          items={listItems}
          size='large'
        />
      </PopoverLayout>
    )
  }
}