# frozen_string_literal: true

class Scheduler::RemindExpiredProScheduler
  include Sidekiq::Worker

  sidekiq_options retry: 1
  
  def perform
    expired_accounts(8.days.ago, 7.days.ago).find_each do |acct|
      RemindExpiredAccountProWorker.perform_async(acct.id, '7')
    end

    expired_accounts(17.days.ago, 16.days.ago).find_each do |acct|
      RemindExpiredAccountProWorker.perform_async(acct.id, '16')
    end

    expired_accounts(31.days.ago, 30.days.ago).find_each do |acct|
      RemindExpiredAccountProWorker.perform_async(acct.id, '30')
    end

    expired_accounts(46.days.ago, 45.days.ago).find_each do |acct|
      RemindExpiredAccountProWorker.perform_async(acct.id, '45')
    end

    expired_accounts(61.days.ago, 60.days.ago).find_each do |acct|
      RemindExpiredAccountProWorker.perform_async(acct.id, '60')
    end

    expired_accounts(76.days.ago, 75.days.ago).find_each do |acct|
      RemindExpiredAccountProWorker.perform_async(acct.id, '75')
    end

    expired_accounts(91.days.ago, 90.days.ago).find_each do |acct|
      RemindExpiredAccountProWorker.perform_async(acct.id, '90')
    end
  end

  private

  def expired_accounts(start_date, end_date)
    Account.where('is_pro=FALSE AND pro_expires_at BETWEEN ? AND ?', start_date, end_date)
  end

  
end
