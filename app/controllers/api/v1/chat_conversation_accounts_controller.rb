# frozen_string_literal: true

class Api::V1::ChatConversationAccountsController < Api::BaseController
  before_action -> { authorize_if_got_token! :read, :'read:chats' }
  before_action -> { doorkeeper_authorize! :write, :'write:chats' }

  before_action :require_user!
  before_action :set_account

  def block_messenger
    BlockMessengerService.new.call(current_user.account, @account)
    render json: @account, serializer: REST::RelationshipSerializer, relationships: relationships
  end

  def unblock_messenger
    UnblockMessengerService.new.call(current_user.account, @account)
    render json: @account, serializer: REST::RelationshipSerializer, relationships: relationships
  end

  def mute_chat_conversation
    @chat_conversation_account.is_muted = true
    @chat_conversation_account.save!
    render json: @chat_conversation_account, serializer: REST::ChatConversationAccountSerializer
  end

  def unmute_chat_conversation
    @chat_conversation_account.is_muted = false
    @chat_conversation_account.save!
    render json: @chat_conversation_account, serializer: REST::ChatConversationAccountSerializer
  end

  def set_expiration_policy
    if current_user.account.is_pro
      # : todo :
      render json: @chat_conversation_account, serializer: REST::ChatConversationAccountSerializer
    else
      render json: { error: 'You need to be a GabPRO member to access this' }, status: 422
    end
  end

  private

  def set_account
    @account = Account.find(params[:id])
  end

  def set_chat_conversation
    @chat_conversation = ChatConversation.find(params[:id])
    @chat_conversation_account = ChatConversationAccount.where(
      account: current_account,
      chat_conversation: @chat_conversation
    ).first
  end

  def check_account_suspension
    gone if @account.suspended?
  end

  def relationships(**options)
    AccountRelationshipsPresenter.new([@account.id], current_user.account_id, options)
  end

end
