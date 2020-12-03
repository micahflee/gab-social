# frozen_string_literal: true

class Api::V1::ChatConversations::ApprovedConversationsController < Api::BaseController
  before_action -> { authorize_if_got_token! :read, :'read:chats' }

  before_action :require_user!
  before_action :set_chat_conversation, only: :create
  after_action :insert_pagination_headers

  def index
    @chat_conversations = load_chat_conversations
    render json: @chat_conversations, each_serializer: REST::ChatConversationAccountSerializer
  end

  def show
    render json: @chat_conversation, serializer: REST::ChatConversationAccountSerializer
  end

  def unread_count
    # : todo : make is_unread into unread_count then count
    # count = ChatConversationAccount.where(account: current_account, is_hidden: false, is_approved: true, unread_count: true).count
    render json: 1
  end

  private

  def set_chat_conversation
    @chat_conversation = ChatConversationAccount.where(account: current_account).find(params[:id]).first
  end

  def load_chat_conversations
    paginated_chat_conversations
  end

  def paginated_chat_conversations
    ChatConversationAccount.where(
      account: current_account,
      is_hidden: false,
      is_approved: true
    ).paginate_by_max_id(
      limit_param(DEFAULT_CHAT_CONVERSATION_LIMIT),
      params[:max_id],
      params[:since_id]
    )
  end

  def insert_pagination_headers
    set_pagination_headers(next_path, prev_path)
  end

  def next_path
    if records_continue?
      api_v1_chat_conversations_approved_conversations_url pagination_params(max_id: pagination_max_id)
    end
  end

  def prev_path
    unless paginated_chat_conversations.empty?
      api_v1_chat_conversations_approved_conversations_url pagination_params(since_id: pagination_since_id)
    end
  end

  def pagination_max_id
    paginated_chat_conversations.last.id
  end

  def pagination_since_id
    paginated_chat_conversations.first.id
  end

  def records_continue?
    paginated_chat_conversations.size == limit_param(DEFAULT_CHAT_CONVERSATION_LIMIT)
  end

  def pagination_params(core_params)
    params.slice(:limit).permit(:limit).merge(core_params)
  end

end
