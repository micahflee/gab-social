# frozen_string_literal: true

class FanOutOnWriteService < BaseService

  # Push a status into home and mentions feeds
  # @param [Status] status
  def call(status)
    raise GabSocial::RaceConditionError if status.visibility.nil?

    if status.direct_visibility? || status.limited_visibility?
      # 
    else
      deliver_to_self(status) if status.account.local?
    end
  end

  private

  def deliver_to_self(status)
    Rails.logger.debug "Delivering status #{status.id} to author"
    FeedManager.instance.push_to_home(status.account, status)
  end

end
