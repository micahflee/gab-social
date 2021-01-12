# frozen_string_literal: true

class Api::V1::AccountByUsernameController < EmptyController
  before_action :set_account
  before_action :check_account_suspension!
  before_action :check_account_local!

  def show
    render json: @account, serializer: REST::AccountSerializer
  end

  def set_account
    @account = Account.find_acct!(params[:username])
  end

  def check_account_suspension!
    render json: { error: true }, status: 404 if @account.suspended?
  end

  # if not our domain don't display
  def check_account_local!
    render json: { error: true }, status: 404 unless @account.local?
  end
end
