class Settings::ExpensesController < Admin::BaseController
	def index
    @ammount = Redis.current.get("monthly_funding_ammount") || 0
	end

  def create
    Redis.current.set("monthly_funding_ammount", params[:ammount])
		redirect_to settings_expenses_path
	end

end
