# frozen_string_literal: true

class Scheduler::ExpiringProScheduler
  include Sidekiq::Worker

  sidekiq_options retry: 1

  def perform
    expired_accounts.find_each do |acct|
      ExpireAccountProWorker.perform_async(acct.id)
    end
  end

  private

  def expired_accounts
    Account.where('is_pro=TRUE AND pro_expires_at < ?', Time.now.utc)
  end
end