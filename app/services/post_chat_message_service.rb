# frozen_string_literal: true

class PostChatMessageService < BaseService

  def call(account, options = {})
    @account = account
    @options = options
    @text = @options[:text] || ''
    @chat_conversation = @options[:chat_conversation]

    preprocess_attributes!

    validate_text!
    validate_links!

    set_chat_conversation_recipients!
    set_message_expiration_date!

    process_chat!
    postprocess_chat!

    @chat
  end

  def preprocess_attributes!
    @text = ActionController::Base.helpers.strip_tags(@text)
    unless @chat_conversation
      raise ActiveRecord::RecordInvalid
    end
  rescue ArgumentError
    raise ActiveRecord::RecordInvalid
  end

  def validate_links!
    raise GabSocial::NotPermittedError if LinkBlock.block?(@text)
  end
  
  def validate_text!
    raise GabSocial::NotPermittedError if @text.nil? || @text.strip.length == 0
  end

  def process_chat!
    @chat = ChatMessage.create!(
      from_account: @account,
      chat_conversation: @chat_conversation,
      text: @text
      expires_at: @expires_at
    )
  end

  def postprocess_chat!
    @chat_conversation_recipients_accounts = ChatConversationAccount.where(chat_conversation: @chat_conversation)
    @chat_conversation_recipients_accounts.each do |recipient|
      recipient.last_chat_message_id = @chat.id
      recipient.is_hidden = false  # reset to show unless blocked

      # Get not mine
      if @account_conversation.id != recipient.id
        recipient.unread_count = recipient.unread_count + 1

        # : todo :
        # check if muting, redis
        payload = InlineRenderer.render(@chat, recipient.account, :chat_message)
        Redis.current.publish("chat_messages:#{recipient.account.id}", Oj.dump(event: :notification, payload: payload))
      else
        recipient.unread_count = 0
      end

      recipient.save
    end
  end

  def set_chat_conversation_recipients!
    # : todo :
    # check if chat blocked
    # check if normal blocked
    
    @account_conversation = ChatConversationAccount.where(account: @account, chat_conversation: @chat_conversation).first
  rescue ArgumentError
    raise ActiveRecord::RecordInvalid
  end

  def set_message_expiration_date
    case @account_conversation.expiration_policy
    when :five_minutes
      @expires_at = 5.minutes
    when :sixty_minutes
      @expires_at = 1.hour
    when :six_hours
      @expires_at = 6.hours
    when :one_day
      @expires_at = 1.day
    when :three_days
      @expires_at = 3.days
    when :one_week
      @expires_at = 1.week
    else
      @expires_at = nil
    end
    
    @expires_at 
  end

end
