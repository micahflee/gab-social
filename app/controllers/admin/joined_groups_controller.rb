# frozen_string_literal: true

module Admin
  class JoinedGroupsController < BaseController
    before_action :set_account

    PER_PAGE = 25

    def index
      authorize :account, :index?
      @groups = @account.groups.page(params[:page]).per(PER_PAGE)
    end

    def set_account
      @account = Account.find(params[:account_id])
    end
  end
end
