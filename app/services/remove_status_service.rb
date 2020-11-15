# frozen_string_literal: true

class RemoveStatusService < BaseService
  include Redisable

  def call(status, **options)
    @payload      = Oj.dump(event: :delete, payload: status.id.to_s)
    @status       = status
    @account      = status.account
    @tags         = status.tags.pluck(:name).to_a
    @mentions     = status.active_mentions.includes(:account).to_a
    @reblogs      = status.reblogs.includes(:account).to_a
    @options      = options

    RedisLock.acquire(lock_options) do |lock|
      if lock.acquired?
        remove_from_self if status.account.local?
        remove_from_followers
        remove_from_lists
        remove_from_affected
        remove_reblogs
        remove_from_hashtags
        remove_from_pro

        @status.destroy!
      else
        raise GabSocial::RaceConditionError
      end
    end

    # There is no reason to send out Undo activities when the
    # cause is that the original object has been removed, since
    # original object being removed implicitly removes reblogs
    # of it. The Delete activity of the original is forwarded
    # separately.
    return if !@account.local? || @options[:original_removed]
  end

  private

  def remove_from_self
    FeedManager.instance.unpush_from_home(@account, @status)
  end

  def remove_from_followers
    @account.followers_for_local_distribution.reorder(nil).find_each do |follower|
      FeedManager.instance.unpush_from_home(follower, @status)
    end
  end

  def remove_from_lists
    @account.lists_for_local_distribution.select(:id, :account_id).reorder(nil).find_each do |list|
      FeedManager.instance.unpush_from_list(list, @status)
    end
  end

  def remove_from_affected
    @mentions.map(&:account).select(&:local?).each do |account|
      redis.publish("timeline:#{account.id}", @payload)
    end
  end

  def remove_reblogs
    # We delete reblogs of the status before the original status,
    # because once original status is gone, reblogs will disappear
    # without us being able to do all the fancy stuff

    @reblogs.each do |reblog|
      RemoveStatusService.new.call(reblog, original_removed: true)
    end
  end

  def remove_from_hashtags
    return unless @status.public_visibility?

    @tags.each do |hashtag|
      redis.publish("timeline:hashtag:#{hashtag}", @payload)
      redis.publish("timeline:hashtag:#{hashtag}:local", @payload) if @status.local?
    end
  end

  def remove_from_pro
    if @account.is_pro || @account.is_donor || @account.is_investor || @account.is_verified
      redis.publish('timeline:pro', @payload)
    end
  end

  def lock_options
    { redis: Redis.current, key: "distribute:#{@status.id}" }
  end
end
