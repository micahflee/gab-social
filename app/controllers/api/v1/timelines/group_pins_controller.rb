# frozen_string_literal: true

class Api::V1::Timelines::GroupPinsController < Api::BaseController
  before_action :require_user!
  before_action :set_group
  before_action :set_statuses

  def show
    if current_user
      render json: @statuses,
            each_serializer: REST::StatusSerializer,
            relationships: StatusRelationshipsPresenter.new(@statuses, current_user.account_id, group_id: @group.id)
    else
      render json: @statuses, each_serializer: REST::StatusSerializer
    end
  end

  private

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
    statuses = []
    @group.pinned_statuses.each do |s|
      statuses << s
    end
    statuses
  end

end
