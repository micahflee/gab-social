# frozen_string_literal: true

class Api::V1::Accounts::StatusesController < Api::BaseController
  before_action -> { authorize_if_got_token! :read, :'read:statuses' }
  before_action :set_account
  after_action :insert_pagination_headers

  def index
    # if attempting to paginate and no user, return error
    if params[:max_id] || params[:since_id] || params[:min_id]
      if current_account.nil?
        render json: { "error": true }, status: 429
      end
    end
      
    @statuses = load_statuses
    render json: @statuses,
           each_serializer: REST::StatusSerializer,
           relationships: StatusRelationshipsPresenter.new(@statuses, current_user&.account_id)
  end

  private

  def set_account
    @account = Account.find(params[:account_id])
  end

  def load_statuses
    cached_account_statuses
  end

  def cached_account_statuses
    cache_collection account_statuses, Status
  end

  def account_statuses
    # : todo : if no current_user, limit date and no: tagged, reblogs, comments
    statuses = truthy_param?(:pinned) ? pinned_scope : permitted_account_statuses

    if current_account.nil?
      statuses = statuses.limit(8)
    else
      statuses = statuses.paginate_by_id(limit_param(DEFAULT_STATUSES_LIMIT), params_slice(:max_id, :since_id, :min_id))
    end

    statuses.merge!(only_media_scope) if truthy_param?(:only_media) && !current_account.nil?
    statuses.merge!(no_replies_scope) if truthy_param?(:exclude_replies)
    statuses.merge!(only_replies_scope) if truthy_param?(:only_comments)
    statuses.merge!(no_reblogs_scope) if truthy_param?(:exclude_reblogs)

    statuses
  end

  def permitted_account_statuses
    @account.statuses.permitted_for(@account, current_account)
  end

  def only_media_scope
    if !current_account.nil?
      Status.where(id: account_media_status_ids)
    else
      nil
    end
  end

  def account_media_status_ids
    # `SELECT DISTINCT id, updated_at` is too slow, so pluck ids at first, and then select id, updated_at with ids.
    # Also, Avoid getting slow by not narrowing down by `statuses.account_id`.
    # When narrowing down by `statuses.account_id`, `index_statuses_20180106` will be used
    # and the table will be joined by `Merge Semi Join`, so the query will be slow.
    @account.statuses.joins(:media_attachments)
            .merge(account_media_ids_query)
            .permitted_for(@account, current_account)
            .paginate_by_max_id(limit_param(DEFAULT_STATUSES_LIMIT), params[:max_id], params[:since_id])
            .reorder(id: :desc).distinct(:id).pluck(:id)
  end

  def account_media_ids_query
    if params[:media_type] == 'video'
      @account.media_attachments.where(type: 2)
    else
      @account.media_attachments.where.not(type: 2)
    end
  end

  def pinned_scope
    @account.pinned_statuses
  end

  def no_replies_scope
    Status.without_replies
  end

  def only_replies_scope
    Status.only_replies
  end

  def no_reblogs_scope
    Status.without_reblogs
  end

  def pagination_params(core_params)
    params.slice(:limit, :only_media, :exclude_replies, :only_comments).permit(:limit, :only_media, :exclude_replies, :only_comments).merge(core_params)
  end

  def insert_pagination_headers
    set_pagination_headers(next_path, prev_path) unless current_account.nil?
  end

  def next_path
    if records_continue? && !current_account.nil?
      api_v1_account_statuses_url pagination_params(max_id: pagination_max_id)
    end
  end

  def prev_path
    unless @statuses.empty? || current_account.nil?
      api_v1_account_statuses_url pagination_params(min_id: pagination_since_id)
    end
  end

  def records_continue?
    @statuses.size == limit_param(DEFAULT_STATUSES_LIMIT)
  end

  def pagination_max_id
    @statuses.last.id
  end

  def pagination_since_id
    @statuses.first.id
  end
end
