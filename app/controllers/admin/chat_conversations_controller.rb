# frozen_string_literal: true

module Admin
  class ChatConversationsController < BaseController
    before_action :set_account

    PER_PAGE = 20

    def index
      authorize :account, :index?
      @chatConversationAccounts = ChatConversationAccount.where(account: @account).page(params[:page]).per(PER_PAGE)
    end

    def set_account
      @account = Account.find(params[:account_id])
    end
  end
end
