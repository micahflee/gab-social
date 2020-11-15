# frozen_string_literal: true

class Api::V1::Statuses::PinsController < Api::BaseController
  include Authorization

  before_action -> { doorkeeper_authorize! :write, :'write:accounts' }
  before_action :require_user!
  before_action :set_status

  def create
    StatusPin.create!(account: current_account, status: @status)
    render json: @status, serializer: REST::StatusSerializer
  end

  def show
    # is status pinned by user?
  end

  def destroy
    pin = StatusPin.find_by(account: current_account, status: @status)

    if pin
      pin.destroy!
    end

    render json: @status, serializer: REST::StatusSerializer
  end

  private

  def set_status
    @status = Status.find(params[:status_id])
  end

end
