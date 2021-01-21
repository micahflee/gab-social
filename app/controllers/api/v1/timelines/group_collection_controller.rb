# frozen_string_literal: true

class Api::V1::Timelines::GroupCollectionController < Api::BaseController
  before_action :require_user!
  before_action :set_collection_type
  before_action :set_sort_type
  before_action :set_statuses

  after_action :insert_pagination_headers, unless: -> { @statuses.empty? }

  def show
    if current_account
      render json: @statuses,
        each_serializer: REST::StatusSerializer,
        relationships: StatusRelationshipsPresenter.new(@statuses, current_account.id)
    else
      render json: [], each_serializer: REST::StatusSerializer
    end
  end

  def set_collection_type
    @collection_type = nil
    @collection_type = params[:id] if ['featured', 'member'].include? params[:id]

    if @collection_type.nil?
      return render json: { error: 'Invalid collection type' }, status: 422
    end

    return @collection_type
  end

  private

  def set_sort_type
    @sort_type = 'newest'
    @sort_type = params[:sort_by] if [
      'hot',
      'newest',
      'recent',
      'top_today',
      'top_weekly',
      'top_monthly',
      'top_yearly',
      'top_all_time',
    ].include? params[:sort_by]

    if @collection_type === 'featured' && (@sort_type == 'newest' || @sort_type == 'recent')
      @sort_type = 'hot'
    end

    return @sort_type
  end

  def set_statuses
    @statuses = cached_group_collection_statuses
  end

  def cached_group_collection_statuses
    cache_collection group_collection_statuses, Status
  end

  def group_collection_statuses
    @groupIds = []
    if @collection_type == 'featured'
      @groupIds = FetchGroupsService.new.call("featured")
    elsif @collection_type == 'member' && !current_account.nil?
      @groupIds = current_account.groups.pluck(:id)
    end

    if current_account
      SortingQueryBuilder.new.call(@sort_type, @groupIds, params[:page], current_account).reject {|status|
        FeedManager.instance.filter?(:home, status, current_account.id)
      }
    else
      return []
      # page = [params[:page].to_i.abs, MIN_UNAUTHENTICATED_PAGES].min
      # SortingQueryBuilder.new.call(@sort_type, @groupIds, page)
    end
  end

  def insert_pagination_headers
    set_pagination_headers(next_path, prev_path)
  end

  def pagination_params(core_params)
    params.slice(:limit).permit(:limit).merge(core_params)
  end

  def next_path
    api_v1_timelines_group_collection_url pagination_params(max_id: pagination_max_id)
  end

  def prev_path
    api_v1_timelines_group_collection_url pagination_params(min_id: pagination_since_id)
  end

  def pagination_max_id
    @statuses.last.id
  end

  def pagination_since_id
    @statuses.first.id
  end

end
