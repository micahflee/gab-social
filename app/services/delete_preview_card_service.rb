# frozen_string_literal: true

class DeletePreviewCardService < BaseService
  include Redisable

  def call(preview_card)
    return if preview_card.nil?

    @preview_card = preview_card

    RedisLock.acquire(lock_options) do |lock|
      if lock.acquired?
        @preview_card.destroy!
      else
        raise GabSocial::RaceConditionError
      end
    end
  end

  def lock_options
    { redis: Redis.current, key: "distribute_preview_card:#{@preview_card.id}" }
  end
end
