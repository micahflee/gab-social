# frozen_string_literal: true

class Api::V1::Accounts::CredentialsController < Api::BaseController
  before_action -> { doorkeeper_authorize! :read, :'read:accounts' }, except: [:update]
  before_action -> { doorkeeper_authorize! :write, :'write:accounts' }, only: [:update]
  before_action :require_user!

  def show
    @account = current_account
    render json: @account, serializer: REST::CredentialAccountSerializer
  end

  def update
    @account = current_account
    # : todo : add link blocking check for bio
    UpdateAccountService.new.call(@account, account_params, raise_error: true)
    UserSettingsDecorator.new(current_user).update(user_settings_params) if user_settings_params
    render json: @account, serializer: REST::CredentialAccountSerializer
  end

  def resend_email_confirmation
    @account = current_account

    if !@account.user.confirmed?
      Redis.current.with do |conn|
        redisResult = conn.get("account:#{@account.id}:last_email_confirmation_resend") || 0

        @lastSentDate = redisResult
        if redisResult != 0
          @lastSentDate = Time.at(redisResult.to_i).utc
        end

        if @lastSentDate == 0 || (@lastSentDate != 0 && Time.now.utc - @lastSentDate >= 1.hour)
          @user = Account.find(@account.id).user || raise(ActiveRecord::RecordNotFound)
          conn.set("account:#{@account.id}:last_email_confirmation_resend", Time.now.utc.to_i)
          @user.resend_confirmation_instructions
        end
      end
    end

    render json: { success: true, message: 'ok' }
  end

  private

  def account_params
    params.permit(:display_name, :note, :avatar, :header, :locked, :bot, :discoverable, fields_attributes: [:name, :value])
  end

  def user_settings_params
    return nil unless params.key?(:source)

    source_params = params.require(:source)

    {
      'setting_default_privacy' => source_params.fetch(:privacy, @account.user.setting_default_privacy),
      'setting_default_sensitive' => source_params.fetch(:sensitive, @account.user.setting_default_sensitive),
      'setting_default_language' => source_params.fetch(:language, @account.user.setting_default_language),
    }
  end

end
