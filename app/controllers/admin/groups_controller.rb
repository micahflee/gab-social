# frozen_string_literal: true

module Admin
  class GroupsController < BaseController
    before_action :set_group, except: [:index]
    before_action :set_accounts, only: [:show]
  
    def index
      authorize :group, :index?
      @groups = filtered_groups.page(params[:page])
    end

    def show
      authorize :group, :index?
    end

    def update
      if @group.update(resource_params)
        redirect_to admin_group_path(@group.id), notice: I18n.t('generic.changes_saved_msg')
      else
        render action: :edit
      end
    end
  
    def destroy
      authorize @group, :destroy?
      @group.destroy!
      log_action :destroy, @group
      flash[:notice] = 'Group destroyed'
      redirect_to admin_groups_path
    end

    def make_me_admin
      GroupAccount.create(group: @group, account: current_account, role: 'admin')
      redirect_to admin_group_path(@group.id), notice: 'You are now an admin of this group'
    end
  
    private
  
    def set_group
      @group = Group.find(params[:id])
    end
  
    def set_accounts
      @admins = GroupAccount.where(group: @group, role: 'admin')
      @mods = GroupAccount.where(group: @group, role: 'moderator')
    end

    def resource_params
      params.require(:group).permit(
        :title,
        :description,
        # :slug,
        :tags,
        :is_private,
        :is_archived,
        :is_visible,
        :is_featured,
        :is_nsfw
      )
    end
  
    def filtered_groups
      GroupFilter.new(filter_params).results
    end

    def filter_params
      params.permit(
        :title,
        :description,
        :id,
        :member_count_gte,
        :created_at_gte
      )
    end
  end
end
  