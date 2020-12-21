# frozen_string_literal: true

class Api::V1::ChatConversations::MessagesController < Api::BaseController
  before_action -> { authorize_if_got_token! :read, :'read:chats' }
  before_action -> { doorkeeper_authorize! :write, :'write:chats' }
  
  before_action :require_user!
  before_action :set_chat_conversation
  before_action :set_chat_messages

  after_action :insert_pagination_headers, unless: -> { @chats.empty? }

  def show
    render json: @chats, each_serializer: REST::ChatMessageSerializer
  end

  def destroy_all
    if current_user.account.is_pro
      PurgeChatMessagesService.new.call(current_user.account, @chat_conversation)
      @chat_conversation_account = ChatConversationAccount.where(
        account: current_user.account,
        chat_conversation: @chat_conversation
      ).first
      render json: @chat_conversation_account, serializer: REST::ChatConversationAccountSerializer
    else
      render json: { error: 'You need to be a GabPRO member to access this' }, status: 422
    end
  end

  private

  def set_chat_conversation
    @chat_conversation = ChatConversation.find(params[:id])
  end

  def set_chat_messages
    @chats = cached_conversation_chats
  end

  def cached_conversation_chats
    cache_collection conversation_chats, ChatMessage
  end

  def conversation_chats
    chats = ChatMessage.where(
      chat_conversation: @chat_conversation
    ).paginate_by_id(
      limit_param(DEFAULT_CHAT_CONVERSATION_MESSAGE_LIMIT),
      params_slice(:max_id, :since_id, :min_id)
    ).reject { |chat_message| FeedManager.instance.filter?(:chat_message, chat_message, current_account.id) }
  end

  def insert_pagination_headers
    set_pagination_headers(next_path, prev_path)
  end

  def pagination_params(core_params)
    params.slice(:limit).permit(:limit).merge(core_params)
  end

  def next_path
    if records_continue?
      api_v1_chat_conversations_message_url params[:id], pagination_params(max_id: pagination_max_id)
    end
  end

  def prev_path
    unless @chats.empty?
      api_v1_chat_conversations_message_url params[:id], pagination_params(since_id: pagination_since_id)
    end
  end

  def pagination_max_id
    @chats.last.id
  end

  def pagination_since_id
    @chats.first.id
  end

  def records_continue?
    @chats.size == limit_param(DEFAULT_CHAT_CONVERSATION_MESSAGE_LIMIT)
  end

end
