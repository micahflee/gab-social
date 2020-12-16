class Settings::TrendingHashtagsController < Admin::BaseController
	def index
    @trending_hashtags = Redis.current.get("admin_trending_hashtags") || ''
	end

  def create
    Redis.current.set("admin_trending_hashtags", params[:trending_hashtags])
		redirect_to settings_trending_hashtags_path
	end
end
