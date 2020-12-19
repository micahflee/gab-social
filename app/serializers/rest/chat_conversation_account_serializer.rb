# frozen_string_literal: true

class REST::ChatConversationAccountSerializer < ActiveModel::Serializer
  attributes :id, :is_hidden, :is_approved, :unread_count,
             :is_unread, :chat_conversation_id, :created_at,
             :is_muted, :chat_message_expiration_policy

  has_many :participant_accounts, key: :other_accounts, serializer: REST::AccountSerializer
  has_one :last_chat_message, serializer: REST::ChatMessageSerializer, unless: :last_chat_message_id?

  def id
    object.id.to_s
  end

  def chat_conversation_id
    object.chat_conversation_id.to_s
  end

  def last_chat_message_id?
    object.last_chat_message_id.nil?
  end

  def is_unread
    object.unread_count > 0
  end

  def chat_message_expiration_policy
    case object.chat_message_expiration_policy
      when ChatConversationAccount::EXPIRATION_POLICY_MAP[:five_minutes]
        return 'five_minutes'
      when ChatConversationAccount::EXPIRATION_POLICY_MAP[:one_hour]
        return 'one_hour'
      when ChatConversationAccount::EXPIRATION_POLICY_MAP[:six_hours]
        return 'six_hours'
      when ChatConversationAccount::EXPIRATION_POLICY_MAP[:one_day]
        return 'one_day'
      when ChatConversationAccount::EXPIRATION_POLICY_MAP[:three_days]
        return 'three_days'
      when ChatConversationAccount::EXPIRATION_POLICY_MAP[:one_week]
        return 'one_week'
      else
        return nil
    end
  end

end
