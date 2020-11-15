# frozen_string_literal: true

module AccountControllerConcern
  extend ActiveSupport::Concern

  FOLLOW_PER_PAGE = 12

  included do
    before_action :set_account
    before_action :check_account_suspension
    before_action :set_instance_presenter
  end

  private

  def set_account
    @account = Account.find_acct!(username_param)
  end

  def set_instance_presenter
    @instance_presenter = InstancePresenter.new
  end

  def username_param
    params[:account_username]
  end

  def check_account_suspension
    if @account.suspended?
      skip_session!
      expires_in(3.minutes, public: true)
      gone
    end
  end
end
