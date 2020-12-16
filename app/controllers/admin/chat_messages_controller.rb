# frozen_string_literal: true

module Admin
  class ChatMessagesController < BaseController
    before_action :set_account

    PER_PAGE = 100

    def index
      authorize :account, :index?
      @followers = ChatMessage.where(from_account: @account).page(params[:page]).per(PER_PAGE)
    end

    def set_account
      @account = Account.find(params[:account_id])
    end
  end
end
