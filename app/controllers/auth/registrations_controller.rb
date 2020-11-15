# frozen_string_literal: true

class Auth::RegistrationsController < Devise::RegistrationsController
  layout :determine_layout

  before_action :set_challenge, only: [:new]
  before_action :configure_sign_up_params, only: [:create]
  before_action :set_sessions, only: [:edit, :update]
  before_action :set_instance_presenter, only: [:new, :create, :update]
  before_action :set_body_classes, only: [:new, :create, :edit, :update]
  before_action :set_cache_headers, only: [:edit, :update]

  def new
    super(&:build_invite_request)
  end

  def create
    if session[:challenge_answer].to_s == params[:user][:challenge].to_s.strip
      # Reset after, may be errors to return and this ensures its still visible
      set_challenge
      super
    else
      return false
    end
  end

  def destroy
    not_found
  end

  protected

  def update_resource(resource, params)
    params[:password] = nil if Devise.pam_authentication && resource.encrypted_password.blank?
    super
  end

  def build_resource(hash = nil)
    super(hash)

    resource.locale             = I18n.locale
    resource.agreement          = true
    resource.current_sign_in_ip = request.remote_ip

    resource.build_account if resource.account.nil?
  end

  def configure_sign_up_params
    devise_parameter_sanitizer.permit(:sign_up) do |u|
      u.permit({ account_attributes: [:username] }, :email, :password, :password_confirmation)
    end
  end

  def after_sign_up_path_for(_resource)
    new_user_session_path
  end

  def after_inactive_sign_up_path_for(_resource)
    new_user_session_path
  end

  def after_update_path_for(_resource)
    edit_user_registration_path
  end

  private

  def set_instance_presenter
    @instance_presenter = InstancePresenter.new
  end

  def set_body_classes
    @body_classes = %w(edit update).include?(action_name) ? 'admin' : ''
  end

  def set_challenge
    @challenge_add_1 = rand(0...9)
    @challenge_add_2 = rand(0...9)
    session[:challenge_answer] = @challenge_add_1 + @challenge_add_2
  end

  def determine_layout
    %w(edit update).include?(action_name) ? 'admin' : 'auth'
  end

  def set_sessions
    @sessions = current_user.session_activations
  end

  def set_cache_headers
    response.headers['Cache-Control'] = 'no-cache, no-store, max-age=0, must-revalidate'
  end
end
