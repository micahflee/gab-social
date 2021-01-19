# frozen_string_literal: true

class GroupFilter
  attr_reader :params

  def initialize(params)
    @params = params
  end

  def results
    scope = Group
    params.each do |key, value|
      scope = scope.merge scope_for(key, value) if !value.nil? && !value.empty?
    end
    scope
  end

  def scope_for(key, value)
    case key.to_sym
    when :id
      Group.where(id: value)
    when :title
      Group.where("LOWER(title) LIKE LOWER(?)", "%#{value}%")
    when :description
      Group.where("LOWER(description) LIKE LOWER(?)", "%#{value}%")
    when :member_count_gte
      Group.where("member_count >= ?", value)
    when :created_at_gte
      Group.where("created_at >= ?", value)
    else
      raise "Unknown filter: #{key}"
    end
  end
end
