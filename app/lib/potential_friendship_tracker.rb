# frozen_string_literal: true

class PotentialFriendshipTracker
  EXPIRE_AFTER = 90.days.seconds
  MAX_ITEMS    = 80

  WEIGHTS = {
    reply: 1,
    favourite: 10,
    reblog: 20,
  }.freeze

  class << self
    include Redisable

    def record(account_id, target_account_id, action)
      return if account_id == target_account_id

      key    = "interactions:#{account_id}"
      weight = WEIGHTS[action]

      redis.with do |conn|
        conn.zincrby(key, weight, target_account_id)
        conn.zremrangebyrank(key, 0, -MAX_ITEMS)
        conn.expire(key, EXPIRE_AFTER)
      end
    end

    def remove(account_id, target_account_id)
      redis.with do |conn|
        conn.zrem("interactions:#{account_id}", target_account_id)
      end
    end

    def get(account_id, limit: 10, offset: 0)
      account_ids = []
      redis.with do |conn|
        account_ids = conn.zrevrange("interactions:#{account_id}", offset, limit)
      end
      return [] if account_ids.empty?
      Account.searchable.where(id: account_ids).local
    end
  end
end
