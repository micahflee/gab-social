# frozen_string_literal: true

class Api::V1::Timelines::TagController < Api::BaseController
  before_action :load_tag
  before_action :require_user!, only: [:show]
  after_action :insert_pagination_headers, unless: -> { @statuses.empty? }

  def show
    @statuses = tagged_statuses
    render json: @statuses,
           each_serializer: REST::StatusSerializer,
           relationships: StatusRelationshipsPresenter.new(@statuses, current_user&.account_id)
  end

  private

  def load_tag
    @tag = Tag.find_normalized(params[:id])
  end

  def tagged_statuses
    if @tag.nil?
      []
    else
      statuses = tag_timeline_statuses.paginate_by_id(
        limit_param(DEFAULT_STATUSES_LIMIT),
        params_slice(:max_id, :since_id, :min_id)
      )

      statuses
    end
  end

  def tag_timeline_statuses
    HashtagQueryService.new.call(@tag, params.slice(:any, :all, :none), current_account)
  end

  def insert_pagination_headers
    set_pagination_headers(next_path, prev_path)
  end

  def pagination_params(core_params)
    params.slice(:local, :limit, :only_media).permit(:local, :limit, :only_media).merge(core_params)
  end

  def next_path
    api_v1_timelines_tag_url params[:id], pagination_params(max_id: pagination_max_id)
  end

  def prev_path
    api_v1_timelines_tag_url params[:id], pagination_params(min_id: pagination_since_id)
  end

  def pagination_max_id
    @statuses.last.id
  end

  def pagination_since_id
    @statuses.first.id
  end
end
