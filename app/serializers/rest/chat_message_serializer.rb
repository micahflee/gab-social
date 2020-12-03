# frozen_string_literal: true

class REST::ChatMessageSerializer < ActiveModel::Serializer
  attributes :id, :text, :language, :from_account_id,
             :chat_conversation_id, :created_at

  def id
    object.id.to_s
  end
end
