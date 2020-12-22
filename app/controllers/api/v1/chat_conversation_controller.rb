# frozen_string_literal: true

class Api::V1::ChatConversationController < Api::BaseController
  before_action -> { authorize_if_got_token! :read, :'read:chats' }
  before_action -> { doorkeeper_authorize! :write, :'write:chats' }

  before_action :require_user!
  before_action :set_account, only: :create
  before_action :set_chat_conversation, only: [
      :show,
      :mark_chat_conversation_approved,
      :mark_chat_conversation_hidden,
      :mark_chat_conversation_read,
      :set_expiration_policy
    ]

  def show
    render json: {}, each_serializer: REST::ChatConversationAccountSerializer
  end

  def create
    chat_conversation_account = find_or_create_conversation
    render json: chat_conversation_account, serializer: REST::ChatConversationAccountSerializer
  end

  def mark_chat_conversation_read
    @chat_conversation_account.update!(unread_count: 0)
    render json: @chat_conversation_account, serializer: REST::ChatConversationAccountSerializer
  end

  def mark_chat_conversation_hidden
    @chat_conversation_account.update!(is_hidden: true)
    render json: @chat_conversation_account, serializer: REST::ChatConversationAccountSerializer
  end

  def mark_chat_conversation_approved
    approved_conversation_count = ChatConversationAccount.where(account: @account, is_hidden: false, is_approved: true).count
    if approved_conversation_count >= ChatConversationAccount::PER_ACCOUNT_APPROVED_LIMIT
      render json: { error: true, message: "You have #{approved_conversation_count} active chat conversations. The limit is #{ChatConversationAccount::PER_ACCOUNT_APPROVED_LIMIT}. Delete some conversations first before approving any more requests." }
    else  
      @chat_conversation_account.update!(is_approved: true)
      render json: @chat_conversation_account, serializer: REST::ChatConversationAccountSerializer
    end
  end

  def set_expiration_policy
    if current_user.account.is_pro
      case params[:expiration]
        when 'five_minutes'
          @expires_at = ChatConversationAccount::EXPIRATION_POLICY_MAP[:five_minutes]
        when 'one_hour'
          @expires_at = ChatConversationAccount::EXPIRATION_POLICY_MAP[:one_hour]
        when 'six_hours'
          @expires_at = ChatConversationAccount::EXPIRATION_POLICY_MAP[:six_hours]
        when 'one_day'
          @expires_at = ChatConversationAccount::EXPIRATION_POLICY_MAP[:one_day]
        when 'three_days'
          @expires_at = ChatConversationAccount::EXPIRATION_POLICY_MAP[:three_days]
        when 'one_week'
          @expires_at = ChatConversationAccount::EXPIRATION_POLICY_MAP[:one_week]
        else
          @expires_at = nil
      end
      @chat_conversation_account.chat_message_expiration_policy = @expires_at
      @chat_conversation_account.save!
      render json: @chat_conversation_account, serializer: REST::ChatConversationAccountSerializer
    else
      render json: { error: 'You need to be a GabPRO member to access this' }, status: 422
    end
  end

  private

  def find_or_create_conversation
    chat = ChatConversationAccount.find_by(account: current_account, participant_account_ids: [@account.id.to_s])
    return chat unless chat.nil?
    my_chat = CreateChatConversationService.new.call(current_account, [@account])
    return my_chat
  end

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

end
