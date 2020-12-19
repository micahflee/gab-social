# frozen_string_literal: true

class Scheduler::ExpiringChatMessagesScheduler
  include Sidekiq::Worker
  
  def perform
    expired_chat_messages.find_each do |chat_message|
      DeleteChatMessageWorker.perform_async(chat_message.id)
    end
  end

  private

  def expired_chat_messages
    ChatMessage.unscoped.expired
  end
end