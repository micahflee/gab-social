# frozen_string_literal: true

class DeleteChatMessageWorker
  include Sidekiq::Worker

  sidekiq_options unique: :until_executed

  def perform(chat_message_id)
    return if chat_message_id.nil?
    DeleteChatMessageService.new.call(ChatMessage.find(chat_message_id))
  end
end
