# frozen_string_literal: true

class Api::V1::ChatConversationController < Api::BaseController
  before_action -> { authorize_if_got_token! :read, :'read:chats' }
  before_action -> { doorkeeper_authorize! :write, :'write:chats' }

  before_action :require_user!
  before_action :set_account, only: :create
  before_action :set_chat_conversation, only: [:show, :mark_chat_conversation_approved, :mark_chat_conversation_hidden, :mark_chat_conversation_unread]

  def show
    puts "tilly ChatConversationsController-0"
    render json: {}, each_serializer: REST::ChatConversationAccountSerializer
  end

  def create
    puts "tilly ChatConversationsController-1"
    # : todo :
    # check if already created
    # check if blocked
    # check if chat blocked
    # check if allow anyone to message then create with approved:true
    # unique account id, participants
    chat_conversation_account = find_or_create_conversation
    render json: chat_conversation_account, each_serializer: REST::ChatConversationAccountSerializer
  end

  def mark_chat_conversation_unread
    @chat_conversation_account.update!(is_unread: true)
    render json: @chat_conversation_account, serializer: REST::ChatConversationAccountSerializer
  end

  def mark_chat_conversation_hidden
    @chat_conversation_account.update!(is_hidden: true)
    render json: @chat_conversation_account, serializer: REST::ChatConversationAccountSerializer
  end

  def mark_chat_conversation_approved
    @chat_conversation_account.update!(is_approved: true)
    render json: @chat_conversation_account, serializer: REST::ChatConversationAccountSerializer
  end

  private

  def find_or_create_conversation
    chat = ChatConversationAccount.find_by(account: current_account, participant_account_ids: [@account.id.to_s])

    return chat unless chat.nil?

    chat_conversation = ChatConversation.create
    
    my_chat = ChatConversationAccount.create!(
                account: current_account,
                participant_account_ids: [@account.id.to_s],
                chat_conversation: chat_conversation,
                is_approved: true
              )

    # : todo : if multiple ids
    their_chat = ChatConversationAccount.create!(
                  account: @account,
                  participant_account_ids: [current_account.id.to_s],
                  chat_conversation: chat_conversation,
                  is_approved: false # default as request
                )

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
