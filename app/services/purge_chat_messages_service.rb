# frozen_string_literal: true

class PurgeChatMessagesService < BaseService
  def call(account, chat_conversation)
    unless account.is_pro
      raise GabSocial::NotPermittedError
    end

    # Destroy all
    ChatMessage.where(from_account: account, chat_conversation: chat_conversation).in_batches.destroy_all

    @last_chat_in_conversation = ChatMessage.where(chat_conversation: chat_conversation).first

    @chat_conversation_recipients_accounts = ChatConversationAccount.where(chat_conversation: chat_conversation)
    @chat_conversation_recipients_accounts.each do |recipient|
      # make sure last_chat_message_id in chat_account_conversation gets set to last
      unless @last_chat_in_conversation.nil?
        recipient.last_chat_message_id = @last_chat_in_conversation.id
      else
        recipient.last_chat_message_id = nil
      end

      # Reset and save
      recipient.unread_count = 0
      recipient.save
    end
  end
end
