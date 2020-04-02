# frozen_string_literal: true

class Api::V1::GabTrendsController < Api::BaseController
  respond_to :json

  skip_before_action :set_cache_headers

  def index
    uri = URI('https://trends.gab.com/trend-feed/json')
    uri.query = URI.encode_www_form()

    res = Net::HTTP.get_response(uri)
    render json: res.body if res.is_a?(Net::HTTPSuccess)
  end
end
