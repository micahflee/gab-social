import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { deleteChatConversation } from '../../actions/chat_conversations'
import ConfirmationModal from './confirmation_modal'

class ChatConversationDeleteModal extends React.PureComponent {

  handleClick = () => {
    this.props.onConfirm(this.props.chatConversationId)
  }

  render() {
    const { onClose } = this.props

    return (
      <ConfirmationModal
        title='Delete Conversation'
        message='Are you sure you want to delete this chat conversation? The messages will not be deleted and you the other participant can still view messages.'
        confirm='Delete'
        onConfirm={this.handleClick}
        onClose={onClose}
      />
    )
  }

}

const mapDispatchToProps = (dispatch) => ({
  onDeleteChatConversation: (chatConversationId) => {
    dispatch(deleteChatConversation(chatConversationId))
  },
})

ChatConversationDeleteModal.propTypes = {
  chatConversationId: PropTypes.string.isRequired,
  onDeleteChatConversation: PropTypes.func.isRequired,
}

export default connect(null, mapDispatchToProps)(ChatConversationDeleteModal)