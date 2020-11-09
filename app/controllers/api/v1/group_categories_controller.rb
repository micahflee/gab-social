# frozen_string_literal: true

class Api::V1::GroupCategoriesController < EmptyController

  def index
    data = ActiveModelSerializers::SerializableResource.new(GroupCategories.all, each_serializer: REST::GroupCategoriesSerializer)
    render json: data.to_json, content_type: 'application/json'
  end

end
