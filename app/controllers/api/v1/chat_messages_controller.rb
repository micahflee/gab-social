# frozen_string_literal: true

class Api::V1::ChatMessagesController < Api::BaseController
  before_action -> { authorize_if_got_token! :read, :'read:chats' }
  before_action -> { doorkeeper_authorize! :write, :'write:chats' }

  before_action :require_user!
  before_action :set_chat_conversation, only: :create
  before_action :set_chat_conversation_recipients, only: :create

  def create
    @chat = ChatMessage.create!(
      from_account: current_account,
      chat_conversation: @chat_conversation,
      text: ActionController::Base.helpers.strip_tags(params[:text])
    )

    # : todo :
    # check if blocked

    @chat_conversation_recipients.each do |account|
      payload = InlineRenderer.render(@chat, account, :chat_message)
      Redis.current.publish("chat_messages:#{account.id}", Oj.dump(event: :notification, payload: payload))
    end

    render json: @chat, serializer: REST::ChatMessageSerializer
  end

  def destroy
    puts "tilly destry chat"
    
    @chat = ChatMessage.where(from_account: current_user.account).find(params[:id])

    puts "tilly @chat: " + @chat.inspect

    # : todo :
    # make sure last_chat_message_id in chat_account_conversation gets set to last

    @chat.destroy!

    render json: @chat, serializer: REST::ChatMessageSerializer
  end

  private

  def set_chat_conversation
    @chat_conversation = ChatConversation.find(params[:chat_conversation_id])
  end

  def set_chat_conversation_recipients
    account_conversation = ChatConversationAccount.where(account: current_user.account, chat_conversation: @chat_conversation).first
    puts "tilly account_conversation - " + account_conversation.inspect
    @chat_conversation_recipients = Account.where(id: account_conversation.participant_account_ids)
  end

  def chat_params
    params.permit(:text, :chat_conversation_id)
  end

end
