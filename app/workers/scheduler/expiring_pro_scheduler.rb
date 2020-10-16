# frozen_string_literal: true

class Scheduler::ExpiringProScheduler
  include Sidekiq::Worker

  sidekiq_options queue: 'mailers', retry: 12
  
  def perform
    expired_accounts.find_each do |acct|
      ExpireAccountProWorker.perform_async(acct.id)
    end
  end

  private

  def expired_accounts
    Account.where('is_pro=TRUE AND pro_expires_at BETWEEN ? AND ?', 1.day.ago, Time.now.utc)
  end
end