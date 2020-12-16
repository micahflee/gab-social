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

end
