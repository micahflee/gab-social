import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';
import classNames from 'classnames/bind'
import { Link } from 'react-router-dom';
import { openModal } from '../../actions/modal';
import { me, isStaff } from '../../initial_state';
import DropdownMenuContainer from '../../containers/dropdown_menu_container';
import ComposeFormContainer from '../../features/compose/containers/compose_form_container';
import Icon from '../icon';

const messages = defineMessages({
  delete: { id: 'status.delete', defaultMessage: 'Delete' },
  edit: { id: 'status.edit', defaultMessage: 'Edit' },
  direct: { id: 'status.direct', defaultMessage: 'Direct message @{name}' },
  mention: { id: 'status.mention', defaultMessage: 'Mention @{name}' },
  mute: { id: 'account.mute', defaultMessage: 'Mute @{name}' },
  block: { id: 'account.block', defaultMessage: 'Block @{name}' },
  reply: { id: 'status.reply', defaultMessage: 'Reply' },
  comment: { id: 'status.comment', defaultMessage: 'Comment' },
  more: { id: 'status.more', defaultMessage: 'More' },
  share: { id: 'status.share', defaultMessage: 'Share' },
  replyAll: { id: 'status.replyAll', defaultMessage: 'Reply to thread' },
  reblog: { id: 'status.reblog', defaultMessage: 'Repost' },
  quote: { id: 'status.quote', defaultMessage: 'Quote' },
  reblog_private: { id: 'status.reblog_private', defaultMessage: 'Repost to original audience' },
  cancel_reblog_private: { id: 'status.cancel_reblog_private', defaultMessage: 'Un-repost' },
  cannot_reblog: { id: 'status.cannot_reblog', defaultMessage: 'This post cannot be reposted' },
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
  copy: { id: 'status.copy', defaultMessage: 'Copy link to status' },
  group_remove_account: { id: 'status.remove_account_from_group', defaultMessage: 'Remove account from group' },
  group_remove_post: { id: 'status.remove_post_from_group', defaultMessage: 'Remove status from group' },
});

const mapDispatchToProps = (dispatch) => ({
  onOpenUnauthorizedModal() {
    dispatch(openModal('UNAUTHORIZED'));
  },
});

class StatusActionBarItem extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    icon: PropTypes.string.isRequired,
    active: PropTypes.bool,
    disabled: PropTypes.bool,
  }

  render() {
    const { title, onClick, icon, active, disabled } = this.props

    const cx = classNames.bind(styles)

    const btnClasses = cx({
      default: 1,
      text: 1,
      fontSize13PX: 1,
      fontWeight500: 1,
      cursorPointer: 1,
      displayFlex: 1,
      justifyContentCenter: 1,
      flexRow: 1,
      alignItemsCenter: 1,
      paddingVertical10PX: 1,
      paddingHorizontal10PX: 1,
      width100PC: 1,
      radiusSmall: 1,
      outlineFocusBrand: 1,
      backgroundTransparent: 1,
      backgroundSubtle_onHover: 1,
      colorSubtle: 1,
    })

    return (
      <div className={[styles.default, styles.flexGrow1, styles.paddingHorizontal10PX].join(' ')}>
        <button
          className={btnClasses}
          onClick={onClick}
          active={active}
          disabled={disabled}
        >
          <Icon width='16px' height='16px' id={icon} className={[styles.default, styles.marginRight10PX, styles.fillColorSubtle].join(' ')} />
          {title}
        </button>
      </div>
    )
  }
}

export default @connect(null, mapDispatchToProps)
@injectIntl
class StatusActionBar extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    status: ImmutablePropTypes.map.isRequired,
    onOpenUnauthorizedModal: PropTypes.func.isRequired,
    onReply: PropTypes.func,
    onQuote: PropTypes.func,
    onFavourite: PropTypes.func,
    onReblog: PropTypes.func,
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
  };

  // Avoid checking props that are functions (and whose equality will always
  // evaluate to false. See react-immutable-pure-component for usage.
  updateOnProps = [
    'status',
    'withDismiss',
  ]

  handleReplyClick = () => {
    if (me) {
      this.props.onReply(this.props.status, this.context.router.history);
    } else {
      this.props.onOpenUnauthorizedModal();
    }
  }

  handleQuoteClick = () => {
    if (me) {
      this.props.onQuote(this.props.status, this.context.router.history);
    } else {
      this.props.onOpenUnauthorizedModal();
    }
  }

  handleFavouriteClick = () => {
    if (me) {
      this.props.onFavourite(this.props.status);
    } else {
      this.props.onOpenUnauthorizedModal();
    }
  }

  handleReblogClick = e => {
    if (me) {
      this.props.onReblog(this.props.status, e);
    } else {
      this.props.onOpenUnauthorizedModal();
    }
  }

  handleDeleteClick = () => {
    this.props.onDelete(this.props.status, this.context.router.history);
  }

  handleEditClick = () => {
    this.props.onEdit(this.props.status);
  }

  handlePinClick = () => {
    this.props.onPin(this.props.status);
  }

  handleMentionClick = () => {
    this.props.onMention(this.props.status.get('account'), this.context.router.history);
  }

  handleMuteClick = () => {
    this.props.onMute(this.props.status.get('account'));
  }

  handleBlockClick = () => {
    this.props.onBlock(this.props.status);
  }

  handleOpen = () => {
    this.context.router.history.push(`/${this.props.status.getIn(['account', 'acct'])}/posts/${this.props.status.get('id')}`);
  }

  handleEmbed = () => {
    this.props.onEmbed(this.props.status);
  }

  handleReport = () => {
    this.props.onReport(this.props.status);
  }

  handleConversationMuteClick = () => {
    this.props.onMuteConversation(this.props.status);
  }

  handleCopy = () => {
    const url = this.props.status.get('url');
    const textarea = document.createElement('textarea');

    textarea.textContent = url;
    textarea.style.position = 'fixed';

    document.body.appendChild(textarea);

    try {
      textarea.select();
      document.execCommand('copy');
    } catch (e) {
      //
    } finally {
      document.body.removeChild(textarea);
    }
  }

  handleGroupRemoveAccount = () => {
    const { status } = this.props;

    this.props.onGroupRemoveAccount(status.getIn(['group', 'id']), status.getIn(['account', 'id']));
  }

  handleGroupRemovePost = () => {
    const { status } = this.props;

    this.props.onGroupRemoveStatus(status.getIn(['group', 'id']), status.get('id'));
  }

  _makeMenu = (publicStatus) => {
    const { status, intl: { formatMessage }, withDismiss, withGroupAdmin } = this.props;
    const mutingConversation = status.get('muted');

    let menu = [];

    menu.push({ text: formatMessage(messages.open), action: this.handleOpen });

    if (publicStatus) {
      menu.push({ text: formatMessage(messages.copy), action: this.handleCopy });
      menu.push({ text: formatMessage(messages.embed), action: this.handleEmbed });
    }

    if (!me) {
      return menu;
    }

    menu.push(null);

    if (status.getIn(['account', 'id']) === me || withDismiss) {
      menu.push({ text: formatMessage(mutingConversation ? messages.unmuteConversation : messages.muteConversation), action: this.handleConversationMuteClick });
      menu.push(null);
    }

    if (status.getIn(['account', 'id']) === me) {
      if (publicStatus) {
        menu.push({ text: formatMessage(status.get('pinned') ? messages.unpin : messages.pin), action: this.handlePinClick });
      } else {
        if (status.get('visibility') === 'private') {
          menu.push({ text: formatMessage(status.get('reblogged') ? messages.cancel_reblog_private : messages.reblog_private), action: this.handleReblogClick });
        }
      }
      menu.push({ text: formatMessage(messages.delete), action: this.handleDeleteClick });
      menu.push({ text: formatMessage(messages.edit), action: this.handleEditClick });
    } else {
      menu.push({ text: formatMessage(messages.mention, { name: status.getIn(['account', 'username']) }), action: this.handleMentionClick });
      menu.push(null);
      menu.push({ text: formatMessage(messages.mute, { name: status.getIn(['account', 'username']) }), action: this.handleMuteClick });
      menu.push({ text: formatMessage(messages.block, { name: status.getIn(['account', 'username']) }), action: this.handleBlockClick });
      menu.push({ text: formatMessage(messages.report, { name: status.getIn(['account', 'username']) }), action: this.handleReport });

      if (isStaff) {
        menu.push(null);
        menu.push({ text: formatMessage(messages.admin_account, { name: status.getIn(['account', 'username']) }), href: `/admin/accounts/${status.getIn(['account', 'id'])}` });
        menu.push({ text: formatMessage(messages.admin_status), href: `/admin/accounts/${status.getIn(['account', 'id'])}/statuses/${status.get('id')}` });
      }

      if (withGroupAdmin) {
        menu.push(null);
        menu.push({ text: formatMessage(messages.group_remove_account), action: this.handleGroupRemoveAccount });
        menu.push({ text: formatMessage(messages.group_remove_post), action: this.handleGroupRemovePost });
      }
    }

    return menu;
  }

  render () {
    const { status, intl: { formatMessage } } = this.props;

    const publicStatus = ['public', 'unlisted'].includes(status.get('visibility'));

    const replyCount = status.get('replies_count');
    const replyIcon = (status.get('in_reply_to_id', null) === null) ? 'reply' : 'reply-all';
    const replyTitle = (status.get('in_reply_to_id', null) === null) ? formatMessage(messages.reply) : formatMessage(messages.replyAll);

    const reblogCount = status.get('reblogs_count');
    const reblogTitle = !publicStatus ? formatMessage(messages.cannot_reblog) : formatMessage(messages.reblog);

    const favoriteCount = status.get('favourites_count');

    const shareButton = ('share' in navigator) && status.get('visibility') === 'public' && (
      <IconButton className='status-action-bar-button' title={formatMessage(messages.share)} icon='share-alt' onClick={this.handleShareClick} />
    );

    const menu = this._makeMenu(publicStatus);

    const items = [
      {
        title: formatMessage(messages.like),
        icon: 'like',
        active: status.get('favourited'),
        onClick: this.handleFavouriteClick,
      },
      {
        title: formatMessage(messages.comment),
        icon: 'comment',
        active: 0,
        onClick: this.handleReplyClick,
      },
      {
        title: reblogTitle,
        icon: (status.get('visibility') === 'private') ? 'lock' : 'repost',
        disabled: !publicStatus,
        active: status.get('reblogged'),
        onClick: this.handleReblogClick,
      },
      {
        title: formatMessage(messages.share),
        icon: 'share',
        active: false,
        onClick: this.handleFavouriteClick,
      },
    ]

    const hasInteractions = favoriteCount > 0 || replyCount > 0 || reblogCount > 0
    const shouldCondense = (!!status.get('card') || status.get('media_attachments').size > 0) && !hasInteractions

    const cx = classNames.bind(styles)

    const containerClasses = cx({
      default: 1,
      paddingHorizontal10PX: 1,
      marginTop10PX: !shouldCondense,
      marginTop5PX: shouldCondense,
    })

    const innerContainerClasses = cx({
      default: 1,
      paddingVertical2PX: 1,
      flexRow: 1,
      width100PC: 1,
      borderTop1PX: !shouldCondense,
      borderColorSubtle: !shouldCondense,
      marginTop5PX: hasInteractions,
    })

    const interactionBtnClasses = cx({
      default: 1,
      text: 1,
      colorSubtle: 1,
      cursorPointer: 1,
      fontSize15PX: 1,
      fontWeightNormal: 1,
      marginRight10PX: 1,
      paddingVertical5PX: 1,
    })

    return (
      <div className={containerClasses}>
        {
          hasInteractions &&
          <div className={[styles.default, styles.flexRow, styles.paddingHorizontal5PX].join(' ')}>
            { favoriteCount > 0 &&
              <button className={interactionBtnClasses}>
                {favoriteCount}
                &nbsp;Likes
              </button>
            }
            { replyCount > 0 &&
              <button className={interactionBtnClasses}>
                {replyCount}
                &nbsp;Comments
              </button>
            }
            { reblogCount > 0 &&
              <button className={interactionBtnClasses}>
                {reblogCount}
                &nbsp;Reposts
              </button>
            }
          </div>
        }
        <div className={innerContainerClasses}>
          <div className={[styles.default, styles.flexRow, styles.paddingVertical2PX, styles.width100PC].join(' ')}>
            {
              items.map((item, i) => (
                <StatusActionBarItem key={`status-action-bar-item-${i}`} {...item} />
              ))
            }

            {/*<div className='status-action-bar__dropdown'>
              <DropdownMenuContainer
                status={status}
                items={menu}
                icon='ellipsis-h'
                size={18}
                direction='right'
                title={formatMessage(messages.more)}
              />
            </div>*/}
          </div>
        </div>
        <div className='status-action-bar__comment'>
          {/*<ComposeFormContainer shouldCondense statusId={status.get('id')} />*/}
        </div>
      </div>
    );
  }

}
