# frozen_string_literal: true

class ActivityTracker
  EXPIRE_AFTER = 90.days.seconds

  class << self
    include Redisable

    def increment(prefix)
      key = [prefix, current_week].join(':')

      redis.with do |conn|
        conn.incrby(key, 1)
        conn.expire(key, EXPIRE_AFTER)
      end
    end

    def record(prefix, value)
      key = [prefix, current_week].join(':')

      redis.with do |conn|
        conn.pfadd(key, value)
        conn.expire(key, EXPIRE_AFTER)
      end
    end

    private

    def current_week
      Time.zone.today.cweek
    end
  end
end
