# frozen_string_literal: true

class DeleteChatMessageService < BaseService
  include Redisable

  def call(chat_message)
    return if chat_message.nil?

    @chat_message = chat_message

    RedisLock.acquire(lock_options) do |lock|
      if lock.acquired?
        @chat_message.destroy!
      else
        raise GabSocial::RaceConditionError
      end
    end
  end

  def lock_options
    { redis: Redis.current, key: "distribute_chat_message:#{@chat_message.id}" }
  end
end
