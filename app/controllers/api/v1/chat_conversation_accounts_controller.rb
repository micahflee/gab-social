# frozen_string_literal: true

class Api::V1::ChatConversationAccountsController < Api::BaseController
  before_action -> { authorize_if_got_token! :read, :'read:chats' }
  before_action -> { doorkeeper_authorize! :write, :'write:chats' }

  before_action :require_user!
  before_action :set_account, only: [:block_messenger, :unblock_messenger, :messenger_block_relationships]
  before_action :check_account_suspension, only: [:block_messenger, :unblock_messenger, :messenger_block_relationships]
  before_action :set_chat_conversation, except: [:block_messenger, :unblock_messenger, :messenger_block_relationships, :search]

  def block_messenger
    @block = BlockChatMessengerService.new.call(current_user.account, @account)
    render json: @account,
           serializer: REST::ChatMessengerBlockedSerializer,
           chat_blocking: true
  end

  def unblock_messenger
    UnblockChatMessengerService.new.call(current_user.account, @account)
    render json: @account,
           serializer: REST::ChatMessengerBlockedSerializer,
           chat_blocking: false
  end

  def messenger_block_relationships
    chat_blocking = current_user.account.chat_blocking?(@account)
    chat_blocked_by = current_user.account.chat_blocked_by?(@account, current_account)
    render json: @account,
           serializer: REST::ChatMessengerBlockedSerializer,
           chat_blocking: chat_blocking,
           chat_blocked_by: chat_blocked_by
  end

  def mute_chat_conversation
    @chat_conversation_account.update!(is_muted: true)
    render json: @chat_conversation_account, serializer: REST::ChatConversationAccountSerializer
  end

  def unmute_chat_conversation
    @chat_conversation_account.update!(is_muted: false)
    render json: @chat_conversation_account, serializer: REST::ChatConversationAccountSerializer
  end

  def search
    # : todo :
    search_conversations = [] #ChatConversationAccount.where(account: current_account, is_hidden: false, is_approved: true).map(&:participant_account_ids)
                          # .joins(:account).where("accounts.display_name ILIKE ?", "%#{params[:q]}%")
    render json: search_conversations, each_serializer: REST::ChatConversationAccountSerializer
  end

  private

  def set_account
    @account = Account.find(params[:account_id])
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
