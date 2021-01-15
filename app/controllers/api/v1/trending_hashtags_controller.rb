# frozen_string_literal: true

class Api::V1::TrendingHashtagsController < EmptyController

  def show
    tags = Redis.current.get("admin_trending_hashtags") || ""
    tags = tags.strip.split(", ")
    render json: { trending_hashtags: tags }
  end

end
