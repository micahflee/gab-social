# frozen_string_literal: true

class ProcessQuoteService < BaseService
    include StreamEntryRenderer
  
    # Create notification for a quote
    # @param [Status] status Quoting status
    # @return [Status]
    def call(status)
      create_notification(status)
      bump_potential_friendship(status)
    end
  
    private
  
    def create_notification(status)
      quoted_status = status.quote

      if quoted_status.account.local?
        LocalNotificationWorker.perform_async(quoted_status.account_id, status.id, status.class.name)
      end
    end
  
    def bump_potential_friendship(status)
      ActivityTracker.increment('activity:interactions')
      return if status.account.following?(status.quote.account_id)
      PotentialFriendshipTracker.record(status.account_id, status.quote.account_id, :reblog)
    end
  
  end
  