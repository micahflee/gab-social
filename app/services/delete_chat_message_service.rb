# frozen_string_literal: true

class DeleteChatMessageService < BaseService
  def call(account, chatMessageId)    
    @chat = ChatMessage.where(from_account: account).find(chatMessageId)
    
    # : todo :
    # make sure last_chat_message_id in chat_account_conversation gets set to last
    
    @chat.destroy!
  end
end
