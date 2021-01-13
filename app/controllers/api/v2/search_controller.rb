# frozen_string_literal: true

class Api::V2::SearchController <  Api::BaseController
  before_action :require_user!
  
  RESULTS_LIMIT = 25

  def index
    @search = Search.new(search_results)
    render json: @search, serializer: REST::V2::SearchSerializer
  end

  private

  def search_results
    SearchService.new.call(
      params[:q],
      current_account,
      limit_param(RESULTS_LIMIT),
      search_params.merge(resolve: truthy_param?(:resolve))
    )
  end

  def search_params
    params.permit(:type, :onlyVerified, :offset, :min_id, :max_id, :account_id)
  end
end


