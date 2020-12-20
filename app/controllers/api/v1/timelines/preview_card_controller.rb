# frozen_string_literal: true

class Api::V1::Timelines::PreviewCardController < Api::BaseController
  before_action :require_user!
  before_action :set_link
  before_action :set_statuses

  after_action :insert_pagination_headers, unless: -> { @statuses.empty? }

  def show
    render json: @statuses,
           each_serializer: REST::StatusSerializer,
           preview_card_id: params[:id], # : todo :
           relationships: StatusRelationshipsPresenter.new(@statuses, current_user.account_id)
  end

  private

  def set_link
    @link = PreviewCard.find(params[:id])
end

  def set_statuses
    @statuses = cached_link_statuses
  end

  def cached_link_statuses
    cache_collection link_statuses, Status
  end

  def link_statuses
    statuses = Status.joins(
      "LEFT JOIN preview_cards_statuses ON statuses.id = preview_cards_statuses.status_id"
    ).where("preview_cards_statuses.preview_card_id": params[:id]).paginate_by_id(
      limit_param(DEFAULT_STATUSES_LIMIT),
      params_slice(:max_id, :since_id, :min_id)
    ).reject { |status| FeedManager.instance.filter?(:home, status, current_account.id) }
  end

  def insert_pagination_headers
    set_pagination_headers(next_path, prev_path)
  end

  def pagination_params(core_params)
    params.slice(:limit).permit(:limit).merge(core_params)
  end

  def next_path
    api_v1_timelines_preview_card_url params[:id], pagination_params(max_id: pagination_max_id)
  end

  def prev_path
    api_v1_timelines_preview_card_url params[:id], pagination_params(min_id: pagination_since_id)
  end

  def pagination_max_id
    @statuses.last.id
  end

  def pagination_since_id
    @statuses.first.id
  end
end
