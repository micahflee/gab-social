# frozen_string_literal: true

class Api::V1::ChatConversationAccountsController < Api::BaseController
  before_action -> { authorize_if_got_token! :read, :'read:chats' }, except: [:create, :follow, :unfollow, :block, :unblock, :mute, :unmute]
  before_action -> { doorkeeper_authorize! :write, :'write:chats' }, only: [:create]

  before_action :require_user!
  before_action :set_account, except: [:create]

  def show
    # 
  end

  def block
    BlockMessengerService.new.call(current_user.account, @account)
    render json: @account, serializer: REST::RelationshipSerializer, relationships: relationships
  end

  def mute
    MuteMessengerService.new.call(current_user.account, @account, notifications: truthy_param?(:notifications))
    render json: @account, serializer: REST::RelationshipSerializer, relationships: relationships
  end

  def unblock
    UnblockMessengerService.new.call(current_user.account, @account)
    render json: @account, serializer: REST::RelationshipSerializer, relationships: relationships
  end

  def unmute
    UnmuteMessegerService.new.call(current_user.account, @account)
    render json: @account, serializer: REST::RelationshipSerializer, relationships: relationships
  end

  private

  def set_account
  #   @account = Account.find(params[:id])
  end

  # def relationships(**options)
  #   AccountRelationshipsPresenter.new([@account.id], current_user.account_id, options)
  # end

  def check_account_suspension
    gone if @account.suspended?
  end

  # def account_params
  #   params.permit(:username, :email, :password, :agreement, :locale)
  # end

end
