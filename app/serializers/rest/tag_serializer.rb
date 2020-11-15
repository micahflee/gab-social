# frozen_string_literal: true

class REST::TagSerializer < ActiveModel::Serializer
  include RoutingHelper

  attributes :name, :url, :history

  def url
    "/tags/#{object.name}"
  end
end
