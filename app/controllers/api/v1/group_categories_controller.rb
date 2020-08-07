# frozen_string_literal: true

class Api::V1::GroupCategoriesController < Api::BaseController
  # respond_to :json

  before_action :require_user!
  skip_before_action :set_cache_headers

  def index
    render_cached_json('api:v1:group_categories', expires_in: 1.minute) do
      ActiveModelSerializers::SerializableResource.new(GroupCategories.all, each_serializer: REST::GroupCategoriesSerializer)
    end
  end

end
