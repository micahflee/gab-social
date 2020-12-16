import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { closePopover } from '../../actions/popover'
import { deleteChatMessage } from '../../actions/chat_messages'
import {
  isChatMessengerBlocked,
  isChatMessengerMuted,
  blockChatMessenger,
  unblockChatMessenger,
  muteChatMessenger,
  unmuteChatMessenger,
  reportChatMessage,
} from '../../actions/chat_conversation_accounts'
import { makeGetChatMessage } from '../../selectors'
import { me } from '../../initial_state'
import PopoverLayout from './popover_layout'
import Button from '../button'
import List from '../list'
import Text from '../text'

class ChatMessageOptionsPopover extends React.PureComponent {

  handleOnDelete = () => {
    this.props.onDeleteChatMessage(this.props.chatMessageId)
  }

  handleOnReport = () => {
    this.props.onReportChatMessage(this.props.chatMessageId)
  }

  handleOnBlock = () => {
    if (this.props.isBlocked) {
      this.props.unblockChatMessenger(this.props.fromAccountId)
    } else {
      this.props.blockChatMessenger(this.props.fromAccountId)
    }
  }
  
  handleOnMute = () => {
    if (this.props.isMuted) {
      this.props.unmuteChatMessenger(this.props.fromAccountId)
    } else {
      this.props.muteChatMessenger(this.props.fromAccountId)
    }
  }

  handleOnClosePopover = () => {
    this.props.onClosePopover()
  }

  render() {
    const {
      isXS,
      isMine,
      isMuted,
      isBlocked,
    } = this.props

    const items = isMine ? [
      {
        hideArrow: true,
        title: 'Delete Message',
        onClick: () => this.handleOnDelete(),
      }
    ] : [
      {
        hideArrow: true,
        title: 'Report Messenger',
        onClick: () => this.handleOnReport(),
      },
      {},
      {
        hideArrow: true,
        title: isBlocked ? 'Unblock Messenger' : 'Block Messenger',
        subtitle: isBlocked ? '' : 'The messenger will not be able to message you.',
        onClick: () => this.handleOnBlock(),
      },
      {
        hideArrow: true,
        title: isMuted ? 'Unmute Messenger' : 'Mute Messenger',
        subtitle: isMuted ? '' : 'You will not be notified of new messsages',
        onClick: () => this.handleOnMute(),
      },
    ]

    return (
      <PopoverLayout
        width={isMine ? 160 : 200}
        isXS={isXS}
        onClose={this.handleOnClosePopover}
      >
        <List items={items} />
      </PopoverLayout>
    )
  }
}

const mapStateToProps = (state, { chatMessageId }) => ({
  isMine: state.getIn(['chat_messages', chatMessageId, 'from_account_id']) === me,
  fromAccountId: state.getIn(['chat_messages', chatMessageId, 'from_account_id']),
  isBlocked: state.getIn(['chat_messages', chatMessageId, 'from_account_id']),
  isMuted: state.getIn(['chat_messages', chatMessageId, 'from_account_id']),
})

const mapDispatchToProps = (dispatch) => ({
  onDeleteChatMessage(chatMessageId) {
    dispatch(deleteChatMessage(chatMessageId))
    dispatch(closePopover())
  },
  onBlock(accountId) {
    dispatch(blockChatMessenger(accountId))
  },
  onUnblock(accountId) {
    dispatch(unblockChatMessenger(accountId))
  },
  onMute(accountId) {
    dispatch(muteChatMessenger(accountId))
  },
  onUnmute(accountId) {
    dispatch(unmuteChatMessenger(accountId))
  },
  onReportChatMessage(chatMessageId) {
    dispatch(reportChatMessage(chatMessageId))
  },
  onClosePopover() {
    dispatch(closePopover())
  },
})

ChatMessageOptionsPopover.propTypes = {
  isXS: PropTypes.bool,
  chatMessageId: PropTypes.string.isRequired,
  isBlocked: PropTypes.bool.isRequired,
  isMuted: PropTypes.bool.isRequired,
  onDeleteChatMessage: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatMessageOptionsPopover)