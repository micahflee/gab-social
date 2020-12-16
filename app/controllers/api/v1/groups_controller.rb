# frozen_string_literal: true

class Api::V1::GroupsController < Api::BaseController
  include Authorization

  # before_action -> { doorkeeper_authorize! :read, :'read:groups' }, only: [:index, :show]
  before_action -> { doorkeeper_authorize! :write, :'write:groups' }, except: [:index, :show]

  before_action :require_user!, except: [:index, :show]
  before_action :set_group, except: [:index, :create, :by_category, :by_tag]

  def index
    case current_tab
      when 'featured'
        @groupIds = FetchGroupsService.new.call("featured")
        @groups = Group.where(id: @groupIds).limit(150).all
      when 'new'
        if !current_user
          return render json: { error: 'This method requires an authenticated user' }, status: 422
        end
        @groups = Group.where(is_archived: false).limit(24).order('created_at DESC').all
      when 'member'
        if !current_user
          return render json: { error: 'This method requires an authenticated user' }, status: 422
        end
        @groups = Group.joins(:group_accounts).where(is_archived: false, group_accounts: { account: current_account }).order('group_accounts.id DESC').all
      when 'admin'
        if !current_user
          render json: { error: 'This method requires an authenticated user' }, status: 422
        end
        @groups = Group.joins(:group_accounts).where(is_archived: false, group_accounts: { account: current_account, role: :admin }).all
    end

    render json: @groups, each_serializer: REST::GroupSerializer
  end

  def by_category
    if !current_user
      return render json: { error: 'This method requires an authenticated user' }, status: 422
    end

    @groupCategory = nil
    if !params[:category].empty?
      @groupCategory = GroupCategories.where("text ILIKE ?", "%#{params[:category]}%")
    end

    @groups = []
    if !@groupCategory.nil?
      @groups = Group.where(is_archived: false, group_categories: @groupCategory).order('member_count DESC').all
    end

    render json: @groups, each_serializer: REST::GroupSerializer
  end

  def by_tag
    if !current_user
      return render json: { error: 'This method requires an authenticated user' }, status: 422
    end

    @groups = []
    if !params[:tag].empty?
      @groups = Group.where(is_archived: false).where("array_to_string(tags, '||') ILIKE :tag", tag: "%#{params[:tag]}%").order('member_count DESC').all
    end

    render json: @groups, each_serializer: REST::GroupSerializer
  end

  def current_tab 
    tab = 'featured'
    tab = params[:tab] if ['featured', 'member', 'admin', 'new'].include? params[:tab]
    return tab
  end

  def show
    render json: @group, serializer: REST::GroupSerializer, individual_group: true
  end

  def create
    authorize :group, :create?
    
    @group = Group.create!(group_params.merge(account: current_account))
    render json: @group, serializer: REST::GroupSerializer
  end

  def update
    authorize @group, :update?

    @group.update!(group_params)
    render json: @group, serializer: REST::GroupSerializer
  end

  def destroy
    authorize @group, :destroy?

    @group.is_archived = true
    @group.save!
    render_empty_success
  end

  def destroy_status
    authorize @group, :destroy_status?

    status = Status.find(params[:status_id])
    GroupUnlinkStatusService.new.call(current_account, @group, status)
    render_empty_success
  end

  def approve_status
    authorize @group, :approve_status?

    status = Status.find(params[:status_id])
    GroupApproveStatusService.new.call(current_account, @group, status)
    render_empty_success
  end

  private

  def set_group
    @group = Group.where(id: params[:id], is_archived: false).includes(:group_categories).first
  end

  def group_params
    thep = params.permit(:title, :password, :cover_image, :description, :is_private, :tags, :is_visible, :group_category_id, :slug)
    thep[:tags] = thep[:tags].split(",") unless thep[:tags].nil?
    thep
  end
end
