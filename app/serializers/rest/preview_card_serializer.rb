# frozen_string_literal: true

class REST::PreviewCardSerializer < ActiveModel::Serializer
  include RoutingHelper

  attributes :id, :url, :title, :description, :type,
             :provider_name, :provider_url,  :html,
             :width, :height, :image, :embed_url, :updated_at

  def image
    object.image? ? full_asset_url(object.image.url(:original)) : nil
  end
end
