import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { closePopover } from '../../actions/popover'
import { deleteChatMessage } from '../../actions/chat_messages'
import {
  blockChatMessenger,
  unblockChatMessenger,
  reportChatMessage,
} from '../../actions/chat_conversation_accounts'
import { fetchRelationships } from '../../actions/accounts'
import { makeGetChatMessage } from '../../selectors'
import { me } from '../../initial_state'
import PopoverLayout from './popover_layout'
import Button from '../button'
import List from '../list'
import Text from '../text'

class ChatMessageOptionsPopover extends React.PureComponent {

  componentDidMount() {
    if (!this.props.isMine) {
      this.props.onFetchRelationships(this.props.fromAccountId)
    }
  }

  handleOnDelete = () => {
    this.props.onDeleteChatMessage(this.props.chatMessageId)
  }

  handleOnReport = () => {
    this.props.onReportChatMessage(this.props.chatMessageId)
  }

  handleOnBlock = () => {
    if (this.props.isBlocked) {
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
    isBlocked: state.getIn(['relationships', fromAccountId, 'chat_blocked_by'], false),
  }
}

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
  onReportChatMessage(chatMessageId) {
    dispatch(reportChatMessage(chatMessageId))
  },
  onFetchRelationships(accountId) {
    // dispatch(fetchRelationships(accountId))
  },
  onClosePopover() {
    dispatch(closePopover())
  },
})

ChatMessageOptionsPopover.propTypes = {
  isXS: PropTypes.bool,
  isMine: PropTypes.bool,
  chatMessageId: PropTypes.string.isRequired,
  isBlocked: PropTypes.bool.isRequired,
  onDeleteChatMessage: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatMessageOptionsPopover)