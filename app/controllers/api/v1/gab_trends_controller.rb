# frozen_string_literal: true

class Api::V1::GabTrendsController < Api::BaseController
  respond_to :json

  skip_before_action :set_cache_headers

  def index
    type = params[:type]
    if type == 'feed'
      body = Redis.current.get("gabtrends:feed")
      
      if body.nil?
        Request.new(:get, "https://trends.gab.com/trend-feed/json").perform do |res|
          if res.code == 200
            body = res.body_with_limit
            Redis.current.set("gabtrends:feed", body) 
            Redis.current.expire("gabtrends:feed", 1.hour.seconds)
          else
            body = nil
          end
        end
      end

      render json: body
    elsif type == 'partner'
      body = Redis.current.get("gabtrends:partner")
      
      if body.nil?
        Request.new(:get, "https://trends.gab.com/partner").perform do |res|
          if res.code == 200
            body = res.body_with_limit
            Redis.current.set("gabtrends:partner", body) 
          Redis.current.expire("gabtrends:partner", 1.minute.seconds)
          else
            body = nil
          end
        end
      end

      render json: body
    else
      raise GabSocial::NotPermittedError
    end
  end

end
