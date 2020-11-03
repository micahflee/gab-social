import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl'
import { me, isStaff, boostModal, deleteModal } from '../../initial_state'
import {
  repost,
  unrepost,
  pin,
  unpin,
  bookmark,
  unbookmark,
} from '../../actions/interactions';
import {
  muteStatus,
  unmuteStatus,
  deleteStatus,
  editStatus,
} from '../../actions/statuses';
import { quoteCompose } from '../../actions/compose'
import {
  fetchGroupRelationships,
  createRemovedAccount,
  groupRemoveStatus,
  pinGroupStatus,
  unpinGroupStatus,
} from '../../actions/groups'
import { initMuteModal } from '../../actions/mutes'
import { initReport } from '../../actions/reports'
import { openModal } from '../../actions/modal'
import {
  closePopover,
  openPopover,
} from '../../actions/popover'
import {
  MODAL_EMBED,
  MODAL_PRO_UPGRADE,
  POPOVER_STATUS_SHARE,
} from '../../constants'
import PopoverLayout from './popover_layout'
import List from '../list'

class StatusOptionsPopover extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  updateOnProps = [
    'status',
    'groupRelationships',
    'isXS',
  ]

  componentDidMount() {
    if (!this.props.groupRelationships && this.props.groupId) {
      this.props.onFetchGroupRelationships(this.props.groupId)
    }
  }

  handleConversationMuteClick = () => {
    this.props.onMuteConversation(this.props.status)
  }

  handleGroupRemoveAccount = () => {
    const { status } = this.props

    this.props.onGroupRemoveAccount(status.getIn(['group', 'id']), status.getIn(['account', 'id']))
  }

  handleGroupRemovePost = () => {
    const { status } = this.props

    this.props.onGroupRemoveStatus(status.getIn(['group', 'id']), status.get('id'))
  }

  handleReport = () => {
    this.props.onReport(this.props.status)
  }

  handleBlockClick = () => {
    this.props.onBlock(this.props.status)
  }

  handleMuteClick = () => {
    this.props.onMute(this.props.status.get('account'))
  }

  handlePinClick = () => {
    this.props.onPin(this.props.status)
  }

  handleGroupPinStatus = () => {
    this.props.onPinGroupStatus(this.props.status)
  }

  handleBookmarkClick = () => {
    if (this.props.isPro) {
      this.props.onBookmark(this.props.status)
    } else {
      this.props.onOpenProUpgradeModal()
    }
  }

  handleDeleteClick = () => {
    this.props.onDelete(this.props.status)
  }

  handleEditClick = () => {
    this.props.onEdit(this.props.status)
  }

  handleRepostClick = (e) => {
    this.props.onRepost(this.props.status, e)
  }

  handleQuoteClick = (e) => {
    this.props.onQuote(this.props.status, this.context.router)
  }

  handleOnOpenSharePopover = () => {
    this.props.onOpenSharePopover(this.props.innerRef, this.props.status)
  }

  handleClosePopover = () => {
    this.props.onClosePopover()
  }

  render() {
    const {
      status,
      intl,
      groupRelationships,
      isXS,
    } = this.props

    const mutingConversation = status.get('muted')
    const publicStatus = ['public', 'unlisted'].includes(status.get('visibility'))
    const isReply = !!status.get('in_reply_to_id')
    const withGroupAdmin = !!groupRelationships ? (groupRelationships.get('admin') || groupRelationships.get('moderator')) : false

    let menu = []

    if (me) {
      if (status.getIn(['account', 'id']) === me) {
        menu.push({
          icon: 'audio-mute',
          hideArrow: true,
          title: intl.formatMessage(mutingConversation ? messages.unmuteConversation : messages.muteConversation),
          onClick: this.handleConversationMuteClick,
        })
      }

      if (isReply) {
        menu.push({
          icon: 'repost',
          hideArrow: true,
          title: intl.formatMessage(status.get('reblogged') ? messages.cancel_repost_private : messages.repost_private),
          onClick: this.handleRepostClick,
        })
        menu.push({
          icon: 'pencil',
          hideArrow: true,
          title: intl.formatMessage(messages.repostWithComment),
          onClick: this.handleQuoteClick,
        })
      }

      menu.push({
        icon: 'bookmark',
        hideArrow: true,
        title: intl.formatMessage(status.get('bookmarked') ? messages.unbookmark : messages.bookmark),
        onClick: this.handleBookmarkClick,
      })
      
      if (status.getIn(['account', 'id']) === me) {
        if (publicStatus) {
          menu.push({
            icon: 'pin',
            hideArrow: true,
            title: intl.formatMessage(status.get('pinned') ? messages.unpin : messages.pin),
            onClick: this.handlePinClick,
          })
        }

        menu.push({
          icon: 'trash',
          hideArrow: true,
          title: intl.formatMessage(messages.delete),
          onClick: this.handleDeleteClick,
        })
        menu.push({
          icon: 'pencil',
          hideArrow: true,
          title: intl.formatMessage(messages.edit),
          onClick: this.handleEditClick,
        })
      } else {
        menu.push({
          icon: 'audio-mute',
          hideArrow: true,
          title: intl.formatMessage(messages.mute, { name: status.getIn(['account', 'username']) }),
          onClick: this.handleMuteClick,
        })
        menu.push({
          icon: 'block',
          hideArrow: true,
          title: intl.formatMessage(messages.block, { name: status.getIn(['account', 'username']) }),
          onClick: this.handleBlockClick,
        })
        menu.push({
          icon: 'warning',
          hideArrow: true,
          title: intl.formatMessage(messages.report, { name: status.getIn(['account', 'username']) }),
          onClick: this.handleReport,
        })
      }
    }

    if (withGroupAdmin) {
      menu.push(null)
      menu.push({
        icon: 'trash',
        hideArrow: true,
        title: intl.formatMessage(messages.group_remove_account),
        onClick: this.handleGroupRemoveAccount,
      })
      menu.push({
        icon: 'trash',
        hideArrow: true,
        title: intl.formatMessage(messages.group_remove_post),
        onClick: this.handleGroupRemovePost,
      })
      menu.push(null)
      menu.push({
        icon: 'pin',
        hideArrow: true,
        title: intl.formatMessage(status.get('pinned_by_group') ? messages.groupUnpin : messages.groupPin),
        onClick: this.handleGroupPinStatus,
      })
    }

    menu.push(null)
    menu.push({
      icon: 'share',
      hideArrow: true,
      title: intl.formatMessage(messages.share),
      onClick: this.handleOnOpenSharePopover,
    })
    
    if (isStaff) {
      menu.push(null)

      menu.push({
        title: intl.formatMessage(messages.admin_account, { name: status.getIn(['account', 'username']) }),
        href: `/admin/accounts/${status.getIn(['account', 'id'])}`
      })
      menu.push({
        title: intl.formatMessage(messages.admin_status),
        href: `/admin/accounts/${status.getIn(['account', 'id'])}/statuses/${status.get('id')}`
      })
    }

    return (
      <PopoverLayout
        isXS={isXS}
        onClose={this.handleClosePopover}
      >
        <List
          scrollKey='profile_options'
          items={menu}
          size={isXS ? 'large' : 'small'}
        />
      </PopoverLayout>
    )
  }

}

const messages = defineMessages({
  delete: { id: 'status.delete', defaultMessage: 'Delete' },
  edit: { id: 'status.edit', defaultMessage: 'Edit' },
  mute: { id: 'account.mute', defaultMessage: 'Mute @{name}' },
  block: { id: 'account.block', defaultMessage: 'Block @{name}' },
  reply: { id: 'status.reply', defaultMessage: 'Reply' },
  more: { id: 'status.more', defaultMessage: 'More' },
  share: { id: 'status.share', defaultMessage: 'Share' },
  replyAll: { id: 'status.replyAll', defaultMessage: 'Reply to thread' },
  repost: { id: 'repost', defaultMessage: 'Repost' },
  quote: { id: 'status.quote', defaultMessage: 'Quote' },
  repost_private: { id: 'status.repost', defaultMessage: 'Repost' },
  cancel_repost_private: { id: 'status.cancel_repost_private', defaultMessage: 'Remove Repost' },
  cannot_repost: { id: 'status.cannot_repost', defaultMessage: 'This post cannot be reposted' },
  cannot_quote: { id: 'status.cannot_quote', defaultMessage: 'This post cannot be quoted' },
  like: { id: 'status.like', defaultMessage: 'Like' },
  report: { id: 'status.report', defaultMessage: 'Report @{name}' },
  muteConversation: { id: 'status.mute_conversation', defaultMessage: 'Mute conversation' },
  unmuteConversation: { id: 'status.unmute_conversation', defaultMessage: 'Unmute conversation' },
  pin: { id: 'status.pin', defaultMessage: 'Pin on profile' },
  unpin: { id: 'status.unpin', defaultMessage: 'Unpin from profile' },
  groupPin: { id: 'status.group_pin', defaultMessage: 'Pin in group' },
  groupUnpin: { id: 'status.group_unpin', defaultMessage: 'Unpin from group' },
  bookmark: { id: 'status.bookmark', defaultMessage: 'Bookmark status' },
  unbookmark: { id: 'status.unbookmark', defaultMessage: 'Remove bookmark' },
  admin_account: { id: 'status.admin_account', defaultMessage: 'Open moderation interface for @{name}' },
  admin_status: { id: 'status.admin_status', defaultMessage: 'Open this status in the moderation interface' },
  group_remove_account: { id: 'status.remove_account_from_group', defaultMessage: 'Remove account from group' },
  group_remove_post: { id: 'status.remove_post_from_group', defaultMessage: 'Remove status from group' },
  repostWithComment: { id: 'repost_with_comment', defaultMessage: 'Repost with comment' },
  share: { id: 'status.share_gab', defaultMessage: 'Share gab' },
})

const mapStateToProps = (state, { status }) => {
  if (!me) return null

  const groupId = status ? status.getIn(['group', 'id']) : undefined
  const groupRelationships = state.getIn(['group_relationships', groupId])

  return {
    groupId,
    groupRelationships,
    isPro: state.getIn(['accounts', me, 'is_pro']),
  }
}

const mapDispatchToProps = (dispatch) => ({

  onMuteConversation(status) {
    dispatch(closePopover())

    if (status.get('muted')) {
      dispatch(unmuteStatus(status.get('id')))
    } else {
      dispatch(muteStatus(status.get('id')))
    }
  },

  onPin(status) {
    dispatch(closePopover())

    if (status.get('pinned')) {
      dispatch(unpin(status))
    } else {
      dispatch(pin(status))
    }
  },

  onBookmark(status) {
    dispatch(closePopover())

    if (status.get('bookmarked')) {
      dispatch(unbookmark(status))
    } else {
      dispatch(bookmark(status))
    }
  },

  onQuote(status, router) {
    dispatch(closePopover())

    dispatch((_, getState) => {
      const state = getState()
      if (state.getIn(['compose', 'text']).trim().length !== 0) {
        dispatch(openModal(MODAL_CONFIRM, {
          message: intl.formatMessage(messages.quoteMessage),
          confirm: intl.formatMessage(messages.quoteConfirm),
          onConfirm: () => dispatch(quoteCompose(status, router)),
        }))
      } else {
        dispatch(quoteCompose(status, router))
      }
    })
  },

  onRepost(status) {
    dispatch(closePopover())
    const alreadyReposted = status.get('reblogged')

    if (boostModal && !alreadyReposted) {
      dispatch(openModal(MODAL_BOOST, {
        status,
        onRepost: () => dispatch(repost(status)),
      }))
    } else {
      if (alreadyReposted) {
        dispatch(unrepost(status))
      } else {
        dispatch(repost(status))
      }
    }
  },

  onDelete(status, history) {
    dispatch(closePopover())

    if (!deleteModal) {
      dispatch(deleteStatus(status.get('id'), history))
    } else {
      dispatch(openModal('CONFIRM', {
        message: <FormattedMessage id='confirmations.delete.message' defaultMessage='Are you sure you want to delete this status?' />,
        confirm: <FormattedMessage id='confirmations.delete.confirm' defaultMessage='Delete' />,
        onConfirm: () => dispatch(deleteStatus(status.get('id'), history)),
      }))
    }
  },

  onEdit(status) {
    dispatch(closePopover())
    dispatch(editStatus(status))
  },

  onMute(account) {
    dispatch(closePopover())
    dispatch(initMuteModal(account))
  },

  onBlock(status) {
    dispatch(closePopover())
    const account = status.get('account')
    dispatch(openModal('BLOCK_ACCOUNT', {
      accountId: account.get('id'),
    }))
  },

  onReport(status) {
    dispatch(closePopover())
    dispatch(initReport(status.get('account'), status))
  },

  onGroupRemoveAccount(groupId, accountId) {
    dispatch(closePopover())
    dispatch(createRemovedAccount(groupId, accountId))
  },

  onGroupRemoveStatus(groupId, statusId) {
    dispatch(closePopover())
    dispatch(groupRemoveStatus(groupId, statusId))
  },

  onFetchGroupRelationships(groupId) {
    dispatch(fetchGroupRelationships([groupId]))
  },

  onOpenSharePopover(targetRef, status) {
    dispatch(closePopover())
    dispatch(openPopover(POPOVER_STATUS_SHARE, {
      targetRef,
      status,
      position: 'top',
    }))
  },

  onOpenProUpgradeModal() {
    dispatch(closePopover())
    dispatch(openModal(MODAL_PRO_UPGRADE))
  },

  onPinGroupStatus(status) {
    dispatch(closePopover())

    if (status.get('pinned_by_group')) {
      dispatch(unpinGroupStatus(status.getIn(['group', 'id']), status.get('id')))
    } else {
      dispatch(pinGroupStatus(status.getIn(['group', 'id']), status.get('id')))
    }
  },

  onClosePopover: () => dispatch(closePopover()),
})

StatusOptionsPopover.propTypes = {
  status: ImmutablePropTypes.map.isRequired,
  groupRelationships: ImmutablePropTypes.map,
  groupId: PropTypes.string,
  onQuote: PropTypes.func.isRequired,
  onRepost: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onMute: PropTypes.func.isRequired,
  onBlock: PropTypes.func.isRequired,
  onReport: PropTypes.func.isRequired,
  onMuteConversation: PropTypes.func.isRequired,
  onPin: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  onFetchGroupRelationships: PropTypes.func.isRequired,
  onOpenEmbedModal: PropTypes.func.isRequired,
  onOpenProUpgradeModal: PropTypes.func.isRequired,
  onClosePopover: PropTypes.func.isRequired,
  isXS: PropTypes.bool,
  isPro: PropTypes.bool,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(StatusOptionsPopover))