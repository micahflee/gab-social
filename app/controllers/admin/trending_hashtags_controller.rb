class Admin::TrendingHashtagsController < Admin::BaseController
	def index
		Redis.current.with do |conn|
	    @trending_hashtags = conn.get("admin_trending_hashtags") || ''
		end
	end

  def create
		Redis.current.with do |conn|
			conn.set("admin_trending_hashtags", params[:trending_hashtags])
		end
		redirect_to admin_trending_hashtags_path
	end
end
