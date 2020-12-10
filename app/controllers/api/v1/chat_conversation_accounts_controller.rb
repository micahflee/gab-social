# frozen_string_literal: true

class Api::V1::ChatConversationAccountsController < Api::BaseController
  before_action -> { authorize_if_got_token! :read, :'read:chats' }
  before_action -> { doorkeeper_authorize! :write, :'write:chats' }

  before_action :require_user!
  before_action :set_account

  def is_messenger_blocked
    # 
  end

  def is_messenger_muted
    # 
  end

  def block_messenger
    BlockMessengerService.new.call(current_user.account, @account)
    render json: @account, serializer: REST::RelationshipSerializer, relationships: relationships
  end

  def mute_messenger
    MuteMessengerService.new.call(current_user.account, @account)
    render json: @account, serializer: REST::RelationshipSerializer, relationships: relationships
  end

  def unblock_messenger
    UnblockMessengerService.new.call(current_user.account, @account)
    render json: @account, serializer: REST::RelationshipSerializer, relationships: relationships
  end

  def unmute_messenger
    UnmuteMessegerService.new.call(current_user.account, @account)
    render json: @account, serializer: REST::RelationshipSerializer, relationships: relationships
  end

  private

  def set_account
    @account = Account.find(params[:id])
  end

  def check_account_suspension
    gone if @account.suspended?
  end

  def relationships(**options)
    AccountRelationshipsPresenter.new([@account.id], current_user.account_id, options)
  end

end
