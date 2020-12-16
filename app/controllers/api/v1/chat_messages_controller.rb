# frozen_string_literal: true

class Api::V1::ChatMessagesController < Api::BaseController
  before_action -> { authorize_if_got_token! :read, :'read:chats' }
  before_action -> { doorkeeper_authorize! :write, :'write:chats' }

  before_action :require_user!

  def create
    @chat_conversation = ChatConversation.find(chat_params[:chat_conversation_id])
    @chat = PostChatMessageService.new.call(current_user.account, text: chat_params[:text], chat_conversation: @chat_conversation)
    render json: @chat, serializer: REST::ChatMessageSerializer
  end

  def destroy
    @chat = DeleteChatMessageService.new.call(current_user.account, params[:id])
    render json: @chat, serializer: REST::ChatMessageSerializer
  end

  private

  def chat_params
    params.permit(:text, :chat_conversation_id)
  end

end
