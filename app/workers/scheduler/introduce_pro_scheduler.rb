# frozen_string_literal: true

class Scheduler::IntroduceProScheduler
  include Sidekiq::Worker

  sidekiq_options queue: 'mailers', retry: 12
  
  def perform
    new_accounts(8.days.ago, 7.days.ago).find_each do |acct|
      IntroduceAccountProWorker.perform_async(acct.id, '7')
    end

    new_accounts(16.days.ago, 15.days.ago).find_each do |acct|
      IntroduceAccountProWorker.perform_async(acct.id, '15')
    end

    new_accounts(31.days.ago, 30.days.ago).find_each do |acct|
      IntroduceAccountProWorker.perform_async(acct.id, '30')
    end
  end

  private

  def new_accounts(start_date, end_date)
    Account.where('is_pro=FALSE AND pro_expires_at IS NULL AND created_at BETWEEN ? AND ?', start_date, end_date)
  end

end
