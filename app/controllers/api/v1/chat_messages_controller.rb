# frozen_string_literal: true

class Api::V1::ChatMessagesController < Api::BaseController
  before_action -> { authorize_if_got_token! :read, :'read:chats' }
  before_action -> { doorkeeper_authorize! :write, :'write:chats' }

  before_action :require_user!
  before_action :set_chat_conversation

  def create
    @chat = ChatMessage.create!(
      from_account: current_account,
      chat_conversation: @chat_conversation,
      text: params[:text]
    )
    
    # : todo :
    # Redis.current.publish("chat_messages:10", 'hi')
    Redis.current.publish("chat_messages:10", Oj.dump(event: :chat_message, payload: InlineRenderer.render(@chat, current_user.account, :chat_message)))

    render json: @chat, serializer: REST::ChatMessageSerializer
  end

  def destroy
    @chat = ChatMessage.where(account: current_user.account).find(params[:id])
    authorize @chat, :destroy?

    # : todo :
    # make sure last_chat_message_id in chat_account_conversation gets set to last

    @chat.destroy!

    render json: @chat, serializer: REST::ChatMessageSerializer
  end

  private

  def set_chat_conversation
    @chat_conversation = ChatConversation.find(params[:chat_conversation_id])
  end

  def chat_params
    params.permit(:text, :chat_conversation_id)
  end

end
