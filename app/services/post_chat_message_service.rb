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
      text: @text,
      expires_at: @expires_at
    )
  end

  def postprocess_chat!
    @chat_conversation_recipients_accounts.each do |recipient|
      recipient.last_chat_message_id = @chat.id

      # Get not mine
      if @account_conversation.id != recipient.id
        # check if recipient is blocking me
        unless recipient.account.chat_blocking?(@account)
          recipient.unread_count = recipient.unread_count + 1
          recipient.is_hidden = false

          # check if muting
          unless recipient.is_muted
            payload = InlineRenderer.render(@chat, recipient.account, :chat_message)
            Redis.current.publish("chat_messages:#{recipient.account.id}", Oj.dump(event: :notification, payload: payload))
          end
        end
      else
        recipient.unread_count = 0
      end

      recipient.save
    end
  end

  def set_chat_conversation_recipients!
    @account_conversation = ChatConversationAccount.where(account: @account, chat_conversation: @chat_conversation).first
    @chat_conversation_recipients_accounts = ChatConversationAccount.where(chat_conversation: @chat_conversation)      
  rescue ArgumentError
    raise ActiveRecord::RecordInvalid
  end

  def set_message_expiration_date!
    @expires_at = nil

    unless @account.is_pro
      return @expires_at
    end
    
    case @account_conversation.chat_message_expiration_policy
      when ChatConversationAccount::EXPIRATION_POLICY_MAP[:five_minutes]
        @expires_at = Time.now + 5.minutes
      when ChatConversationAccount::EXPIRATION_POLICY_MAP[:one_hour]
        @expires_at = Time.now + 1.hour
      when ChatConversationAccount::EXPIRATION_POLICY_MAP[:six_hours]
        @expires_at = Time.now + 6.hours
      when ChatConversationAccount::EXPIRATION_POLICY_MAP[:one_day]
        @expires_at = Time.now + 1.day
      when ChatConversationAccount::EXPIRATION_POLICY_MAP[:three_days]
        @expires_at = Time.now + 3.days
      when ChatConversationAccount::EXPIRATION_POLICY_MAP[:one_week]
        @expires_at = Time.now + 1.week
    end
    
    @expires_at 
  end

end
