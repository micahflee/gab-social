# frozen_string_literal: true

class ReactController < ApplicationController
  before_action :authenticate_user!, only: :react
  before_action :set_referrer_policy_header, only: :react
  before_action :set_initial_state_json, only: :react
  before_action :set_data_for_meta, only: :react

  def react
    #
  end

  private

  def set_data_for_meta
    return if find_route_matches

    if request.path.count("/") == 1 && !request.path.include?("@")
      acctFromPath = request.path.sub("/", "")
      @account = Account.find_local!(acctFromPath)
    end

  end

  def authenticate_user!
    return if user_signed_in?

    # if no current user, dont allow to navigate to these paths
    if find_route_matches
      redirect_to(homepage_path)
    end
  end

  def find_route_matches
    request.path.match(/\A\/(home|group|groups|list|lists|notifications|explore|search|tags|compose|follow_requests|admin|account|settings|filters|timeline|blocks|domain_blocks|mutes)/)
  end

  def set_initial_state_json
    serializable_resource = ActiveModelSerializers::SerializableResource.new(InitialStatePresenter.new(initial_state_params), serializer: InitialStateSerializer)
    @initial_state_json   = serializable_resource.to_json
  end

  def initial_state_params
    if !current_user.nil?
      {
        settings: Web::Setting.find_by(user: current_user)&.data || {},
        push_subscription: current_account.user.web_push_subscription(current_session),
        current_account: current_account,
        token: current_session.token,
        admin: Account.find_local(Setting.site_contact_username.strip.gsub(/\A@/, '')),
      }
    else
      {
        admin: Account.find_local(Setting.site_contact_username.strip.gsub(/\A@/, '')),
      }
    end
  end

  def set_referrer_policy_header
    response.headers['Referrer-Policy'] = 'origin'
  end
end
