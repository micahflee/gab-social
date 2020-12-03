# frozen_string_literal: true

class REST::ChatMessageSerializer < ActiveModel::Serializer
  attributes :id, :text, :language, :from_account_id,
             :chat_conversation_id, :created_at

  def id
    object.id.to_s
  end

  def from_account_id
    object.from_account_id.to_s
  end

  def chat_conversation_id
    object.chat_conversation_id.to_s
  end

end
