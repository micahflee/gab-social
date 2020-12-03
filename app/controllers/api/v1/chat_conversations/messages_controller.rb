# frozen_string_literal: true

class Api::V1::ChatConversations::MessagesController < Api::BaseController
  before_action -> { authorize_if_got_token! :read, :'read:chats' }
  before_action -> { doorkeeper_authorize! :write, :'write:chats' }
  
  before_action :require_user!
  before_action :set_chat_conversation
  before_action :set_chat_messages

  after_action :insert_pagination_headers, unless: -> { @chats.empty? }

  def show
    puts "tilly chat_message_conversations - 1: " + @chats.count.inspect
    render json: @chats, each_serializer: REST::ChatMessageSerializer
  end

  def destroy_all
    puts "tilly destry all chat"
    # : todo :
    # check if is pro
    # @chat = ChatMessage.where(from_account: current_user.account).find(params[:id])

    puts "tilly @chat: " + @chat.inspect

    # : todo :
    # make sure last_chat_message_id in chat_account_conversation gets set to last

    # @chat.destroy!

    # render json: @chat, serializer: REST::ChatMessageSerializer
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
    )
  end

  def insert_pagination_headers
    set_pagination_headers(next_path, nil)
  end

  def pagination_params(core_params)
    params.slice(:limit).permit(:limit).merge(core_params)
  end

  def next_path
    api_v1_chat_conversations_message_url params[:id], pagination_params(since_id: pagination_since_id)
  end

  def pagination_since_id
    @chats.first.id
  end
end
