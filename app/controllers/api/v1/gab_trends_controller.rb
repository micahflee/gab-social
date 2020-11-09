# frozen_string_literal: true

class Api::V1::GabTrendsController < EmptyController
  def index
    if Rails.env != 'development'
      render json: nil
    end

    type = params[:type]
    if type == 'feed'
      body = Redis.current.get("gabtrends:feed")
      
      if body.nil? || body.empty?
        Request.new(:get, "https://trends.gab.com/trend-feed/json").perform do |res|
          Rails.logger.debug "GabTrendsController: #{type} endpoint res code: #{res.code.to_s}"
          if res.code == 200
            body = res.body_with_limit
            Redis.current.set("gabtrends:feed", body) 
            Redis.current.expire("gabtrends:feed", 1.hour.seconds)
            render json: body
          else
            render json: nil
          end
        end
      else
        render json: body
      end
    elsif type == 'partner'
      body = Redis.current.get("gabtrends:partner")
      
      if body.nil? || body.empty?
        Request.new(:get, "https://trends.gab.com/partner").perform do |res|
          Rails.logger.debug "GabTrendsController: #{type} endpoint res code: #{res.code.to_s}"
          if res.code == 200
            body = res.body_with_limit
            Redis.current.set("gabtrends:partner", body) 
            Redis.current.expire("gabtrends:partner", 1.minute.seconds)
            render json: body
          else
            render json: nil
          end
        end
      else
        render json: body
      end
    elsif type == 'news'
      body = Redis.current.get("gabtrends:news")
      
      if body.nil? || body.empty?
        Request.new(:get, "https://news.gab.com/feed/json").perform do |res|
          Rails.logger.debug "GabTrendsController: #{type} endpoint res code: #{res.code.to_s}"
          if res.code == 200
            body = res.body_with_limit
            Redis.current.set("gabtrends:news", body) 
            Redis.current.expire("gabtrends:news", 1.minute.seconds)
            render json: body
          else
            render json: nil
          end
        end
      else
        render json: body
      end
    elsif type == 'rss'
      body = Redis.current.get("gabtrends:feeds")
      
      if body.nil? || body.empty?
        Request.new(:get, "https://trends.gab.com/feed/#{params[:feedId]}?fmt=json&p=#{params[:page]}").perform do |res|
          Rails.logger.debug "GabTrendsController: #{type} endpoint res code: #{res.code.to_s}"
          if res.code == 200
            body = res.body_with_limit
            Redis.current.set("gabtrends:news", body) 
            Redis.current.expire("gabtrends:news", 1.minute.seconds)
            render json: body
          else
            render json: nil
          end
        end
      else
        render json: body
      end
    else
      raise GabSocial::NotPermittedError
    end

  rescue HTTP::TimeoutError, HTTP::ConnectionError, OpenSSL::SSL::SSLError, HTTP::Error
    Rails.logger.debug "Error fetching gabtrends feed: #{type}"
    render json: nil
  end

end
