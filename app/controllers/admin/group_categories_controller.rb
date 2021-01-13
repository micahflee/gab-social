class Admin::GroupCategoriesController < Admin::BaseController	
	before_action :set_category, except: [:index, :new, :create]

	def index
		@categories = GroupCategories.all
	end

	def new
		@category = GroupCategories.new
	end

	def create
		@category = GroupCategories.new(resource_params)
		
		if @category.save
			log_action :create, @category
			redirect_to admin_group_categories_path, notice: I18n.t('promotions.created_msg')
		else
			render :new
		end
	end

	def destroy
		@category.destroy!
		log_action :destroy, @category
		flash[:notice] = I18n.t('promotions.destroyed_msg')
		redirect_to admin_group_categories_path
	end

	private

	def set_category
		@category = GroupCategories.find(params[:id])
	end

	def resource_params
		params.permit(:text)
	end

end
