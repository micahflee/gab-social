# frozen_string_literal: true

class ReactController < ApplicationController
  before_action :authenticate_user!, only: [:react, :home]
  before_action :set_referrer_policy_header, only: [:react, :home]
  before_action :set_initial_state_json, only: [:react, :home]
  before_action :set_data_for_meta, only: [:react, :home]

  before_action :set_instance_presenter

  def react
    # 
  end
  
  def groupBySlug
    @group = Group.where(slug: params[:groupSlug], is_archived: false).first
    unless @group.nil?
      return redirect_to "/groups/#{@group.id}"
    end

    return not_found 
  end

  private

  def set_data_for_meta
    return if find_route_matches && current_account

    if request.path.include?("/groups/")
      groupIdFromPath = request.path.sub("/groups", "").gsub("/", "")
      @group = Group.where(id: groupIdFromPath, is_archived: false).first
    elsif find_public_route_matches
      return
    elsif request.path.count("/") == 1 && request.path.length === 1
      # 
    elsif request.path.count("/") == 1 && !request.path.include?("@")
      acctFromPath = request.path.sub("/", "")
      @account = Account.find_local!(acctFromPath)
    end
  end

  def authenticate_user!
    return if user_signed_in?
    if find_public_route_matches
      return
    elsif find_route_matches
      # if no current user, dont allow to navigate to these paths
      redirect_to(homepage_path)
    end

    return false
  end

  def find_route_matches
    request.path.match(/\A\/(home|news|api|suggestions|links|chat_conversations|chat_conversation_accounts|messages|shortcuts|group|groups|list|lists|notifications|tags|compose|follow_requests|admin|account|settings|filters|timeline|blocks|mutes)/)
  end

  def find_public_route_matches
    request.path.match(/\A\/(about|news|search|groups|explore)/)
  end

  def set_initial_state_json
    serializable_resource = ActiveModelSerializers::SerializableResource.new(InitialStatePresenter.new(initial_state_params), serializer: InitialStateSerializer)
    @initial_state_json = serializable_resource.to_json
  end

  def initial_state_params
    if !current_user.nil?
      {
        settings: Web::Setting.find_by(user: current_user)&.data || {},
        push_subscription: current_account.user.web_push_subscription(current_session),
        current_account: current_account,
        token: current_session.token,
      }
    else 
      return {}
    end
  end

  def set_referrer_policy_header
    response.headers['Referrer-Policy'] = 'origin'
  end

  def set_instance_presenter
    @instance_presenter = InstancePresenter.new
  end
end
