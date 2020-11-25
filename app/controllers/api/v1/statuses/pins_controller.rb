# frozen_string_literal: true

class Api::V1::Statuses::PinsController < Api::BaseController
  include Authorization

  before_action -> { doorkeeper_authorize! :write, :'write:accounts' }
  before_action :require_user!
  before_action :set_status

  def create
    pin = StatusPin.find_by(account: current_account, status: @status)
    if pin.nil?
      StatusPin.create!(account: current_account, status: @status)
      render json: @status, serializer: REST::StatusPinnedSerializer
    else
      return render json: { error: 'Status is already pinned' }, status: 500
    end
  end

  def show
    render json: @status, serializer: REST::StatusPinnedSerializer
  end

  def destroy
    pin = StatusPin.find_by(account: current_account, status: @status)

    if pin
      pin.destroy!
    end

    render json: @status, serializer: REST::StatusPinnedSerializer
  end

  private

  def set_status
    @status = Status.find(params[:status_id])
  end

end
