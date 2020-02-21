import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import RelativeTimestamp from './relative_timestamp'
import DisplayName from './display_name'
import Text from './text'
import DotTextSeperator from './dot_text_seperator'
import Icon from './icon'
import Button from './button'
import Avatar from './avatar'

export default class StatusHeader extends ImmutablePureComponent {

  static propTypes = {
    status: ImmutablePropTypes.map,
  }

  handleStatusOptionsClick() {
    console.log("handleStatusOptionsClick")
  }

  handleOpenStatusEdits() {
    console.log("handleOpenStatusEdits")
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

    if (!me) return menu

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

  render() {
    const { status } = this.props

    const statusUrl = `/${status.getIn(['account', 'acct'])}/posts/${status.get('id')}`;

    // const menu = this._makeMenu(publicStatus);
    // <div className='status-action-bar__dropdown'>
    //   <DropdownMenuContainer
    //     status={status}
    //     items={menu}
    //     icon='ellipsis-h'
    //     size={18}
    //     direction='right'
    //     title={formatMessage(messages.more)}
    //   />
    // </div>

    return (
      <div className={[_s.default, _s.paddingHorizontal15PX, _s.paddingVertical10PX].join(' ')}>
        <div className={[_s.default, _s.flexRow, _s.marginTop5PX].join(' ')}>

          <NavLink
            to={`/${status.getIn(['account', 'acct'])}`}
            title={status.getIn(['account', 'acct'])}
            className={[_s.default, _s.marginRight10PX].join(' ')}
          >
            <Avatar account={status.get('account')} size={50} />
          </NavLink>

          <div className={[_s.default, _s.alignItemsStart, _s.flexGrow1, _s.marginTop5PX].join(' ')}>

            <div className={[_s.default, _s.flexRow, _s.width100PC, _s.alignItemsStart].join(' ')}>
              <NavLink
                className={[_s.default, _s.flexRow, _s.alignItemsStart, _s.noUnderline].join(' ')}
                to={`/${status.getIn(['account', 'acct'])}`}
                title={status.getIn(['account', 'acct'])}
              >
                <DisplayName account={status.get('account')} />
              </NavLink>

              <Button
                text
                backgroundColor='none'
                color='none'
                icon='ellipsis'
                iconWidth='20px'
                iconHeight='20px'
                iconClassName={_s.fillcolorSecondary}
                className={_s.marginLeftAuto}
                onClick={this.handleStatusOptionsClick}
              />
            </div>

            <div className={[_s.default, _s.flexRow, _s.alignItemsCenter, _s.lineHeight15].join(' ')}>
              <Button
                text
                underlineOnHover
                backgroundColor='none'
                color='none'
                to={statusUrl}
              >
                <Text size='small' color='secondary'>
                  <RelativeTimestamp timestamp={status.get('created_at')} />
                </Text>
              </Button>

              <DotTextSeperator />

              <Icon id='globe' width='12px' height='12px' className={[_s.default, _s.displayInline, _s.marginLeft5PX, _s.fillcolorSecondary].join(' ')} />

              {
                !!status.get('group') &&
                <Fragment>
                  <DotTextSeperator />
                  <Button
                    text
                    underlineOnHover
                    backgroundColor='none'
                    color='none'
                    to={`/groups/${status.getIn(['group', 'id'])}`}
                    className={_s.marginLeft5PX}
                  >
                    <Text size='small' color='secondary'>
                      {status.getIn(['group', 'title'])}
                    </Text>
                  </Button>
                </Fragment>
              }

              {
                status.get('revised_at') !== null &&
                <Fragment>
                  <DotTextSeperator />
                  <Button
                    text
                    underlineOnHover
                    backgroundColor='none'
                    color='none'
                    onClick={this.handleOpenStatusEdits}
                    className={_s.marginLeft5PX}
                  >
                    <Text size='small' color='secondary'>
                      Edited
                    </Text>
                  </Button>
                </Fragment>
              }

            </div>
          </div>
        </div>
      </div>
    )
  }

}
