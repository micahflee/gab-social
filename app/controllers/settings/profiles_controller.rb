# frozen_string_literal: true

class Settings::ProfilesController < Settings::BaseController
  include ObfuscateFilename

  layout 'admin'

  before_action :authenticate_user!
  before_action :set_account

  obfuscate_filename [:account, :avatar]
  obfuscate_filename [:account, :header]

  def show
    @account.build_fields
  end

  def update
    # if verified and display_name is different, return flash error and redirect back
    if @account.is_verified && params[:account][:display_name] && @account.display_name != params[:account][:display_name]
      flash[:alert] = 'Unable to change Display name for verified account'
      redirect_to settings_profile_path
    elsif !@account.is_pro && params[:account][:username] && @account.username != params[:account][:username]
      flash[:alert] = 'Unable to change username for your account. You are not GabPRO'
      redirect_to settings_profile_path
    else
      # : todo :
      # only allowed to change username once per day
      if params[:account][:username] && @account.username != params[:account][:username]
        Redis.current.set("username_change:#{account.id}", true) 
        Redis.current.expire("username_change:#{account.id}", 24.huors.seconds)
      end

      if UpdateAccountService.new.call(@account, account_params)
        redirect_to settings_profile_path, notice: I18n.t('generic.changes_saved_msg')
      else
        @account.build_fields
        render :show
      end
    end
  end

  private

  def account_params
    params.require(:account).permit(:display_name, :username, :note, :avatar, :header, :locked, :bot, :discoverable, fields_attributes: [:name, :value])
  end

  def set_account
    @account = current_account
  end
end
