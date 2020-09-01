# frozen_string_literal: true

class ExpireAccountProWorker
  include Sidekiq::Worker

  sidekiq_options queue: 'mailers', retry: 2

  attr_reader :user

  def perform(acct_id)
    @acct = Account.find(acct_id)
    @acct.update(is_pro: false)

    deliver_email
  end

  private

  def deliver_email
    UserMailer.pro_expired(@acct.user).deliver_now!
    @acct.user.touch(:last_emailed_at)
  end
end
