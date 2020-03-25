import PopoverLayout from './popover_layout'
import List from '../list'

export default class StatusOptionsPopover extends PureComponent {
  _makeMenu = (publicStatus) => {
    // const { status, intl: { formatMessage }, withDismiss, withGroupAdmin } = this.props
    // const mutingConversation = status.get('muted')

    let menu = [];

    // menu.push({ text: formatMessage(messages.open), action: this.handleOpen });

    // if (publicStatus) {
    //   menu.push({ text: formatMessage(messages.copy), action: this.handleCopy });
    //   menu.push({ text: formatMessage(messages.embed), action: this.handleEmbed });
    // }

    // if (!me) return menu

    // menu.push(null);

    // if (status.getIn(['account', 'id']) === me || withDismiss) {
    //   menu.push({ text: formatMessage(mutingConversation ? messages.unmuteConversation : messages.muteConversation), action: this.handleConversationMuteClick });
    //   menu.push(null);
    // }

    // if (status.getIn(['account', 'id']) === me) {
    //   if (publicStatus) {
    //     menu.push({ text: formatMessage(status.get('pinned') ? messages.unpin : messages.pin), action: this.handlePinClick });
    //   } else {
    //     if (status.get('visibility') === 'private') {
    //       menu.push({ text: formatMessage(status.get('reblogged') ? messages.cancel_repost_private : messages.repost_private), action: this.handleRepostClick });
    //     }
    //   }
    //   menu.push({ text: formatMessage(messages.delete), action: this.handleDeleteClick });
    //   menu.push({ text: formatMessage(messages.edit), action: this.handleEditClick });
    // } else {
    //   menu.push({ text: formatMessage(messages.mention, { name: status.getIn(['account', 'username']) }), action: this.handleMentionClick });
    //   menu.push(null);
    //   menu.push({ text: formatMessage(messages.mute, { name: status.getIn(['account', 'username']) }), action: this.handleMuteClick });
    //   menu.push({ text: formatMessage(messages.block, { name: status.getIn(['account', 'username']) }), action: this.handleBlockClick });
    //   menu.push({ text: formatMessage(messages.report, { name: status.getIn(['account', 'username']) }), action: this.handleReport });

    //   if (isStaff) {
    //     menu.push(null);
    //     menu.push({ text: formatMessage(messages.admin_account, { name: status.getIn(['account', 'username']) }), href: `/admin/accounts/${status.getIn(['account', 'id'])}` });
    //     menu.push({ text: formatMessage(messages.admin_status), href: `/admin/accounts/${status.getIn(['account', 'id'])}/statuses/${status.get('id')}` });
    //   }

    //   if (withGroupAdmin) {
    //     menu.push(null);
    //     menu.push({ text: formatMessage(messages.group_remove_account), action: this.handleGroupRemoveAccount });
    //     menu.push({ text: formatMessage(messages.group_remove_post), action: this.handleGroupRemovePost });
    //   }
    // }

    return menu;
  }

  render() {
    return (
      <PopoverLayout className={_s.width240PX}>
        <List
          scrollKey='profile_options'
          items={[
            {
              title: 'Help',
              href: 'https://help.gab.com',
            },
            {
              title: 'Settings',
              href: '/settings',
            },
            {
              title: 'Log Out',
              href: '/auth/log_out',
            },
          ]}
          small
        />
      </PopoverLayout>
    )
  }
}