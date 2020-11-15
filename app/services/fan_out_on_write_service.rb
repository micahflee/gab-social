# frozen_string_literal: true

class FanOutOnWriteService < BaseService

  def call(status)
    deliver_to_self(status) if status.account.local?
  end

  private

  def deliver_to_self(status)
    Rails.logger.debug "Delivering status #{status.id} to author"
    FeedManager.instance.push_to_home(status.account, status)
  end

end
