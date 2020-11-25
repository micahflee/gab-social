# frozen_string_literal: true

class Api::V1::Groups::PinsController < Api::BaseController
  include Authorization

  before_action -> { doorkeeper_authorize! :write, :'write:groups' }
  before_action :require_user!
  before_action :set_group
  before_action :set_status

  def create
    authorize @group, :update?

    pin = GroupPinnedStatus.find_by(group: @group, status: @status)
    if pin.nil?
      GroupPinnedStatus.create!(group: @group, status: @status)
      render json: @status, serializer: REST::StatusGroupPinnedSerializer, group_id: @group.id
    else
      return render json: { error: 'Status is already pinned to group' }, status: 500
    end
  end

  def show
    render json: @status, serializer: REST::StatusGroupPinnedSerializer, group_id: @group.id
  end

  def destroy
    authorize @group, :update?

    pin = GroupPinnedStatus.find_by(group: @group, status: @status)
    if pin
      pin.destroy!
    end

    render json: @status, serializer: REST::StatusGroupPinnedSerializer, group_id: @group.id
  end

  private

  def set_status
    @status = Status.find(params[:statusId])
  end

  def set_group
    @group = Group.find(params[:group_id])
  end

end
