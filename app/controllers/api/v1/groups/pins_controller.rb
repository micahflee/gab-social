# frozen_string_literal: true

class Api::V1::Groups::PinsController < Api::BaseController
  include Authorization

  before_action -> { doorkeeper_authorize! :write, :'write:groups' }
  before_action :require_user!
  before_action :set_group
  before_action :set_status

  respond_to :json

  def create
    authorize @group, :update?
    
    GroupPinnedStatus.create!(group: @group, status: @status)
    render json: @status, serializer: REST::StatusSerializer
  end

  def destroy
    authorize @group, :update?

    pin = GroupPinnedStatus.find_by(group: @group, status: @status)

    if pin
      pin.destroy!
    end

    render json: @status, serializer: REST::StatusSerializer
  end

  private

  def set_status
    @status = Status.find(params[:statusId])
  end

  def set_group
    @group = Group.find(params[:group_id])
  end

end
