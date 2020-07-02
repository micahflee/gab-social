# frozen_string_literal: true

class Api::V1::ShopController < Api::BaseController
  before_action :require_user!

  respond_to :json

  skip_before_action :set_cache_headers

  def index
    type = params[:type]
    if type == 'featured_products'
      body = Redis.current.get("gabstore:featuredproducts")
        
      if body.nil?
        uri = URI("https://shop.dissenter.com/product/group/json")
        uri.query = URI.encode_www_form({})

        res = Net::HTTP.get_response(uri)
        if res.is_a?(Net::HTTPSuccess)
          body = res.body
          Redis.current.set("gabstore:featuredproducts", res.body) 
          Redis.current.expire("gabstore:featuredproducts", 15.minutes.seconds)
        end
      end

      render json: body
    else
      raise GabSocial::NotPermittedError
    end
  end

end
