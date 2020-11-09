# frozen_string_literal: true

class Api::V1::PromotionsController < EmptyController

  def index
    data = ActiveModelSerializers::SerializableResource.new(Promotion.active, each_serializer: REST::PromotionSerializer)
    render json: data.to_json, content_type: 'application/json'
  end

end
