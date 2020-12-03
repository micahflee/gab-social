import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ChatEmptyMessageBlock from './components/chat_conversations_empty_block'
import ChatMessageHeader from './components/chat_message_header'
import ChatMessageScrollingList from './components/chat_message_scrolling_list'
import ChatMessagesComposeForm from './components/chat_message_compose_form'
 
class Messages extends React.PureComponent {

  render () {
    const {
      account,
      selectedChatConversationId,
      chatConverationIsRequest,
    } = this.props
    
    return (
      <div className={[_s.d, _s.bgPrimary, _s.h100PC, _s.w100PC].join(' ')}>
        {
          !selectedChatConversationId &&
          <ChatEmptyMessageBlock />
        }
        {
          !!selectedChatConversationId &&
          <div className={[_s.d, _s.h100PC, _s.w100PC].join(' ')}>
            <ChatMessageHeader chatConversationId={selectedChatConversationId} />
            <ChatMessageScrollingList chatConversationId={selectedChatConversationId} />
            {
              !chatConverationIsRequest &&
              <ChatMessagesComposeForm chatConversationId={selectedChatConversationId} />
            }
          </div>
        }
      </div>
    )
  }

}

const mapStateToProps = (state, props) => {
  const selectedChatConversationId = state.getIn(['chats', 'selectedChatConversationId'], null)
  const chatConverationIsRequest = selectedChatConversationId ? !state.getIn(['chat_conversations', selectedChatConversationId, 'is_approved'], null) : false
  return {
    selectedChatConversationId,
    chatConverationIsRequest,
  }
}

Messages.propTypes = {
  selectedChatConversationId: PropTypes.string,
  chatConverationIsRequest: PropTypes.bool.isRequired,
}

export default connect(mapStateToProps)(Messages)