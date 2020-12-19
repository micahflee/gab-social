import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { closePopover } from '../../actions/popover'
import { deleteChatMessage } from '../../actions/chat_messages'
import {
  fetchMessengerBlockingRelationships,
  blockChatMessenger,
  unblockChatMessenger,
  // reportChatMessage,
} from '../../actions/chat_conversation_accounts'
import { makeGetChatMessage } from '../../selectors'
import { me } from '../../initial_state'
import PopoverLayout from './popover_layout'
import Button from '../button'
import List from '../list'
import Text from '../text'

class ChatMessageOptionsPopover extends React.PureComponent {

  componentDidMount() {
    if (!this.props.isMine) {
      this.props.onFetchMessengerBlockingRelationships(this.props.fromAccountId)
    }
  }

  handleOnDelete = () => {
    this.props.onDeleteChatMessage(this.props.chatMessageId)
  }

  handleOnReport = () => {
    this.props.onReportChatMessage(this.props.chatMessageId)
  }

  handleOnBlock = () => {
    if (this.props.isChatBlocked) {
      this.props.onUnblock(this.props.fromAccountId)
    } else {
      this.props.onBlock(this.props.fromAccountId)
    }
  }

  handleOnClosePopover = () => {
    this.props.onClosePopover()
  }

  render() {
    const {
      isXS,
      isMine,
      isChatBlocked,
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
        title: isChatBlocked ? 'Unblock Messenger' : 'Block Messenger',
        subtitle: isChatBlocked ? null : 'The messenger will not be able to message you.',
        onClick: () => this.handleOnBlock(),
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

const mapStateToProps = (state, { chatMessageId }) => {
  const fromAccountId = state.getIn(['chat_messages', chatMessageId, 'from_account_id'])

  return {
    fromAccountId,
    isMine: fromAccountId === me,
    isChatBlocked: state.getIn(['relationships', fromAccountId, 'chat_blocking'], false),
  }
}

const mapDispatchToProps = (dispatch) => ({
  onDeleteChatMessage(chatMessageId) {
    dispatch(deleteChatMessage(chatMessageId))
    dispatch(closePopover())
  },
  onBlock(accountId) {
    dispatch(blockChatMessenger(accountId))
    dispatch(closePopover())
  },
  onUnblock(accountId) {
    dispatch(unblockChatMessenger(accountId))
    dispatch(closePopover())
  },
  onReportChatMessage(chatMessageId) {
    // : todo :
    // dispatch(reportChatMessage(chatMessageId))
    dispatch(closePopover())
  },
  onFetchMessengerBlockingRelationships(accountId) {
    dispatch(fetchMessengerBlockingRelationships(accountId))
  },
  onClosePopover() {
    dispatch(closePopover())
  },
})

ChatMessageOptionsPopover.propTypes = {
  isXS: PropTypes.bool,
  isMine: PropTypes.bool,
  chatMessageId: PropTypes.string.isRequired,
  isChatBlocked: PropTypes.bool.isRequired,
  onDeleteChatMessage: PropTypes.func.isRequired,
  onIsChatMessengerBlocked: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatMessageOptionsPopover)