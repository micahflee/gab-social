class Admin::ExpensesController < Admin::BaseController
	def index
		Redis.current.with do |conn|
			@amount = conn.get("monthly_funding_amount") || 0
		end
	end

  def create
		Redis.current.with do |conn|
			conn.set("monthly_funding_amount", params[:amount])
		end
		redirect_to admin_expenses_path
	end

end
