# frozen_string_literal: true

class Api::V1::GifsController < Api::BaseController
  respond_to :json

  skip_before_action :set_cache_headers

  def index
    uri = URI('https://api.tenor.com/v1/categories')
    params = { :key => "QHFJ0C5EWGBH" }
    uri.query = URI.encode_www_form(params)

    res = Net::HTTP.get_response(uri)
    render json: res.body if res.is_a?(Net::HTTPSuccess)
  end
end
