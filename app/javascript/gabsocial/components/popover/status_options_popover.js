import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { defineMessages, injectIntl } from 'react-intl'
import PopoverLayout from './popover_layout'
import List from '../list'

const messages = defineMessages({
  delete: { id: 'status.delete', defaultMessage: 'Delete' },
  edit: { id: 'status.edit', defaultMessage: 'Edit' },
  mention: { id: 'status.mention', defaultMessage: 'Mention @{name}' },
  mute: { id: 'account.mute', defaultMessage: 'Mute @{name}' },
  block: { id: 'account.block', defaultMessage: 'Block @{name}' },
  reply: { id: 'status.reply', defaultMessage: 'Reply' },
  comment: { id: 'status.comment', defaultMessage: 'Comment' },
  more: { id: 'status.more', defaultMessage: 'More' },
  share: { id: 'status.share', defaultMessage: 'Share' },
  replyAll: { id: 'status.replyAll', defaultMessage: 'Reply to thread' },
  repost: { id: 'repost', defaultMessage: 'Repost' },
  quote: { id: 'status.quote', defaultMessage: 'Quote' },
  repost_private: { id: 'status.repost_private', defaultMessage: 'Repost to original audience' },
  cancel_repost_private: { id: 'status.cancel_repost_private', defaultMessage: 'Un-repost' },
  cannot_repost: { id: 'status.cannot_repost', defaultMessage: 'This post cannot be reposted' },
  cannot_quote: { id: 'status.cannot_quote', defaultMessage: 'This post cannot be quoted' },
  like: { id: 'status.like', defaultMessage: 'Like' },
  open: { id: 'status.open', defaultMessage: 'Expand this status' },
  report: { id: 'status.report', defaultMessage: 'Report @{name}' },
  muteConversation: { id: 'status.mute_conversation', defaultMessage: 'Mute conversation' },
  unmuteConversation: { id: 'status.unmute_conversation', defaultMessage: 'Unmute conversation' },
  pin: { id: 'status.pin', defaultMessage: 'Pin on profile' },
  unpin: { id: 'status.unpin', defaultMessage: 'Unpin from profile' },
  embed: { id: 'status.embed', defaultMessage: 'Embed' },
  admin_account: { id: 'status.admin_account', defaultMessage: 'Open moderation interface for @{name}' },
  admin_status: { id: 'status.admin_status', defaultMessage: 'Open this status in the moderation interface' },
  group_remove_account: { id: 'status.remove_account_from_group', defaultMessage: 'Remove account from group' },
  group_remove_post: { id: 'status.remove_post_from_group', defaultMessage: 'Remove status from group' },
})

export default
@injectIntl
class StatusOptionsPopover extends ImmutablePureComponent {
  static propTypes = {
    status: ImmutablePropTypes.map.isRequired,
    onOpenUnauthorizedModal: PropTypes.func.isRequired,
    onOpenStatusSharePopover: PropTypes.func.isRequired,
    onReply: PropTypes.func,
    onQuote: PropTypes.func,
    onFavorite: PropTypes.func,
    onRepost: PropTypes.func,
    onDelete: PropTypes.func,
    onMention: PropTypes.func,
    onMute: PropTypes.func,
    onBlock: PropTypes.func,
    onReport: PropTypes.func,
    onEmbed: PropTypes.func,
    onMuteConversation: PropTypes.func,
    onPin: PropTypes.func,
    withDismiss: PropTypes.bool,
    withGroupAdmin: PropTypes.bool,
    intl: PropTypes.object.isRequired,
  }
  
  getItems = () => {
    const { status, intl, withDismiss, withGroupAdmin } = this.props
    const mutingConversation = status.get('muted')

    let menu = [];

    menu.push({
      icon: 'circle',
      hideArrow: true,
      title: intl.formatMessage(messages.open),
      onClick: this.handleOpen
    });

    if (publicStatus) {
      menu.push({
        icon: 'circle',
        hideArrow: true,
        title: intl.formatMessage(messages.copy),
        onClick: this.handleCopy,
      })
      menu.push({
        icon: 'circle',
        hideArrow: true,
        title: intl.formatMessage(messages.embed),
        onClick: this.handleEmbed,
      })
    }

    if (!me) return menu

    if (status.getIn(['account', 'id']) === me || withDismiss) {
      menu.push({
        icon: 'circle',
        hideArrow: true,
        title: intl.formatMessage(mutingConversation ? messages.unmuteConversation : messages.muteConversation),
        onClick: this.handleConversationMuteClick,
      })
    }

    if (status.getIn(['account', 'id']) === me) {
      if (publicStatus) {
        menu.push({
          icon: 'circle',
          hideArrow: true,
          title: intl.formatMessage(status.get('pinned') ? messages.unpin : messages.pin),
          onClick: this.handlePinClick,
        })
      } else {
        if (status.get('visibility') === 'private') {
          menu.push({
            title: intl.formatMessage(status.get('reblogged') ? messages.cancel_repost_private : messages.repost_private),
            onClick: this.handleRepostClick
          })
        }
      }
      menu.push({ text: intl.formatMessage(messages.delete), action: this.handleDeleteClick });
      menu.push({ text: intl.formatMessage(messages.edit), action: this.handleEditClick });
    } else {
      menu.push({ text: intl.formatMessage(messages.mention, { name: status.getIn(['account', 'username']) }), action: this.handleMentionClick });
      menu.push({ text: intl.formatMessage(messages.mute, { name: status.getIn(['account', 'username']) }), action: this.handleMuteClick });
      menu.push({ text: intl.formatMessage(messages.block, { name: status.getIn(['account', 'username']) }), action: this.handleBlockClick });
      menu.push({ text: intl.formatMessage(messages.report, { name: status.getIn(['account', 'username']) }), action: this.handleReport });

      if (isStaff) {
        menu.push({ text: intl.formatMessage(messages.admin_account, { name: status.getIn(['account', 'username']) }), href: `/admin/accounts/${status.getIn(['account', 'id'])}` });
        menu.push({ text: intl.formatMessage(messages.admin_status), href: `/admin/accounts/${status.getIn(['account', 'id'])}/statuses/${status.get('id')}` });
      }

      if (withGroupAdmin) {
        menu.push({ text: intl.formatMessage(messages.group_remove_account), action: this.handleGroupRemoveAccount });
        menu.push({ text: intl.formatMessage(messages.group_remove_post), action: this.handleGroupRemovePost });
      }
    }

    return menu;
  }

  render() {
    const items = this.getItems()

    return (
      <PopoverLayout className={_s.width240PX}>
        <List
          size='large'
          scrollKey='profile_options'
          items={items}
        />
      </PopoverLayout>
    )
  }
}