# frozen_string_literal: true

class Api::V1::Timelines::GroupController < Api::BaseController
  before_action :set_group
  before_action :set_sort_type
  before_action :set_statuses

  after_action :insert_pagination_headers, unless: -> { @statuses.empty? }

  def show
    if current_user
      render json: @statuses,
            each_serializer: REST::StatusSerializer,
            relationships: StatusRelationshipsPresenter.new(@statuses, current_user.account_id)
    else
      render json: @statuses, each_serializer: REST::StatusSerializer
    end
  end

  private

  def set_sort_type
    @sort_type = 'newest'
    @sort_type = params[:sort_by] if [
      'newest',
      'recent',
      'top_today',
      'top_weekly',
      'top_monthly',
      'top_yearly',
      'top_all_time',
    ].include? params[:sort_by]

    return @sort_type
  end

  def set_group
    @group = Group.where(id: params[:id], is_archived: false).first
  end

  def set_statuses
    @statuses = cached_group_statuses
  end

  def cached_group_statuses
    cache_collection group_statuses, Status
  end

  def group_statuses
    statuses = nil

    date_limit = 30.days.ago
    top_order = 'status_stats.favourites_count DESC, status_stats.reblogs_count DESC, status_stats.replies_count DESC'

    if @sort_type == 'top_today'
      date_limit = 24.hours.ago
    elsif @sort_type == 'top_weekly'
      date_limit = 7.days.ago
    elsif @sort_type == 'top_monthly'
      date_limit = 30.days.ago
    elsif @sort_type == 'top_yearly'
      date_limit = 1.year.ago
    end

    if current_account
      if @sort_type == 'newest'
        statuses = Status.where(
              group: @group, reply: false
            ).paginate_by_id(
              limit_param(DEFAULT_STATUSES_LIMIT),
              params_slice(:max_id, :since_id, :min_id)
            ).reject { |status| FeedManager.instance.filter?(:home, status, current_account.id) }
      elsif @sort_type == 'recent'
        statuses = Status.where(
            group: @group, reply: false
          ).joins(:status_stat).where(
            'status_stats.replies_count > 0 OR status_stats.reblogs_count > 0 OR status_stats.favourites_count > 0'
          ).order('status_stats.updated_at DESC').paginate_by_id(
            limit_param(DEFAULT_STATUSES_LIMIT),
            params_slice(:max_id, :since_id, :min_id)
          ).reject { |status| FeedManager.instance.filter?(:home, status, current_account.id) }
      elsif ['top_today', 'top_weekly', 'top_monthly', 'top_yearly', 'top_all_time'].include? @sort_type
        if @sort_type == 'top_all_time'
          statuses = Status.unscoped.where(
              group: @group, reply: false
            ).joins(:status_stat).order(top_order)
            .paginate_by_id(
              limit_param(DEFAULT_STATUSES_LIMIT),
              params_slice(:max_id, :since_id, :min_id)
            ).reject { |status| FeedManager.instance.filter?(:home, status, current_account.id) }
        else
          statuses = Status.unscoped.where(
            group: @group, reply: false
          ).where(
            'statuses.created_at > ?', date_limit
          ).joins(:status_stat).order(top_order).paginate_by_id(
            limit_param(DEFAULT_STATUSES_LIMIT),
            params_slice(:max_id, :since_id, :min_id)
          ).reject { |status| FeedManager.instance.filter?(:home, status, current_account.id) }
        end
      end
    else
      if @sort_type == 'newest'
        statuses = Status.where(
              group: @group, reply: false
            ).paginate_by_id(
              limit_param(DEFAULT_STATUSES_LIMIT),
              params_slice(:max_id, :since_id, :min_id)
            )
      elsif @sort_type == 'recent'
        statuses = Status.where(
            group: @group, reply: false
          ).joins(:status_stat).where(
            'status_stats.replies_count > 0 OR status_stats.reblogs_count > 0 OR status_stats.favourites_count > 0'
          ).order('status_stats.updated_at DESC').paginate_by_id(
            limit_param(DEFAULT_STATUSES_LIMIT),
            params_slice(:max_id, :since_id, :min_id)
          )
      elsif ['top_today', 'top_weekly', 'top_monthly', 'top_yearly', 'top_all_time'].include? @sort_type
        if @sort_type == 'top_all_time'
          statuses = Status.unscoped.where(
              group: @group, reply: false
            ).joins(:status_stat).order(top_order)
            .paginate_by_id(
              limit_param(DEFAULT_STATUSES_LIMIT),
              params_slice(:max_id, :since_id, :min_id)
            )
        else
          statuses = Status.unscoped.where(
            group: @group, reply: false
          ).where(
            'statuses.created_at > ?', date_limit
          ).joins(:status_stat).order(top_order).paginate_by_id(
            limit_param(DEFAULT_STATUSES_LIMIT),
            params_slice(:max_id, :since_id, :min_id)
          )
        end
      end
    end

    statuses
  end

  def insert_pagination_headers
    set_pagination_headers(next_path, prev_path)
  end

  def pagination_params(core_params)
    params.slice(:limit).permit(:limit).merge(core_params)
  end

  def next_path
    api_v1_timelines_group_url params[:id], pagination_params(max_id: pagination_max_id)
  end

  def prev_path
    api_v1_timelines_group_url params[:id], pagination_params(min_id: pagination_since_id)
  end

  def pagination_max_id
    @statuses.last.id
  end

  def pagination_since_id
    @statuses.first.id
  end
end
