# frozen_string_literal: true

class Form::ChatMessageBatch
  include ActiveModel::Model
  include AccountableConcern

  attr_accessor :chat_message_ids, :action, :current_account

  def save
    case action
    when 'delete'
      delete_chat_messages
    end
  end

  private

  def delete_chat_messages
    ChatMessage.where(id: chat_message_ids).reorder(nil).find_each do |chat_message|
      DeleteChatMessageWorker.perform_async(chat_message.id)
      log_action :destroy, chat_message
    end

    true
  end
end
