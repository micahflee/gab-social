# frozen_string_literal: true

class ChatMessageFilter
  attr_reader :params

  def initialize(params)
    @params = params
  end

  def results
    scope = ChatMessage
    params.each do |key, value|
      scope = scope.merge scope_for(key, value) if !value.nil? && !value.empty?
    end
    scope
  end

  def scope_for(key, value)
    case key.to_sym
    when :text
      ChatMessage.where("LOWER(text) LIKE LOWER(?)", "%#{value}%")
    when :id
      ChatMessage.where(id: value)
    when :account_id
      ChatMessage.where(from_account_id: value)
    when :created_at_lte
      ChatMessage.where("created_at <= ?", value)
    when :created_at_gte
      ChatMessage.where("created_at >= ?", value)
    else
      raise "Unknown filter: #{key}"
    end
  end
end
