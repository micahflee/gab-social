# frozen_string_literal: true

class REST::ChatMessengerBlockedSerializer < ActiveModel::Serializer
  attributes :target_id, :chat_blocking, :chat_blocked_by

  def target_id
    object.id.to_s
  end

  def chat_blocking
    instance_options[:chat_blocking] || false
  end

  def chat_blocked_by
    instance_options[:chat_blocked_by] || false
  end

end
