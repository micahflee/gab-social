# frozen_string_literal: true

class VerifiedSuggestions
  EXPIRE_AFTER = 12.minute.seconds
  MAX_ITEMS = 12
  KEY = 'popularsuggestions'

  class << self
    include Redisable

    def set(account_ids)
      return if account_ids.nil? || account_ids.empty?
      redis.with do |conn|
        conn.setex(KEY, EXPIRE_AFTER, account_ids)
      end
    end

    def get(account_id)
      account_ids = []
      redis.with do |conn|
        account_ids = conn.get(KEY)
      end

      if account_ids.nil? || account_ids.empty?
        account_ids = Account.searchable
          .where(is_verified: true)
          .discoverable
          .by_recent_status
          .local
          .limit(MAX_ITEMS)
          .pluck(:id)

        set(account_ids) if account_ids.nil? || account_ids.empty?
      else
        account_ids = JSON.parse(account_ids)
      end

      return [] if account_ids.nil? || account_ids.empty?

      Account.where(id: account_ids)
    end
  end
end
