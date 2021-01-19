# frozen_string_literal: true

class LinkBlockFilter
  attr_reader :params

  def initialize(params)
    @params = params
  end

  def results
    scope = LinkBlock
    params.each do |key, value|
      scope = scope.merge scope_for(key, value)
    end
    scope
  end

  def scope_for(key, value)
    case key.to_sym
    when :link
      LinkBlock.where("LOWER(link) LIKE LOWER(?)", "%#{value}%")
    else
      raise "Unknown filter: #{key}"
    end
  end
end
