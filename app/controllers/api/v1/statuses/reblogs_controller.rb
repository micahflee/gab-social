# frozen_string_literal: true

class Api::V1::Statuses::ReblogsController < Api::BaseController
  include Authorization

  before_action -> { doorkeeper_authorize! :write, :'write:statuses' }
  before_action :require_user!

  def create
    @relog = status_for_reblog
    ReblogService.new.call(current_user.account, @relog, reblog_params)
    render json: @relog, serializer: REST::StatusStatSerializer
  end

  def destroy
    @my_relog = status_for_destroy
    @original_status = @my_relog.reblog

    authorize @my_relog, :unreblog?

    RemovalWorker.perform_async(@my_relog.id)

    @reblogs_map = { @original_status.id => false }

    render json: @original_status,
           serializer: REST::StatusStatSerializer,
           unreblog: true,
           relationships: StatusRelationshipsPresenter.new([@original_status], current_user&.account_id, reblogs_map: @reblogs_map)
  end

  private

  def status_for_reblog
    rs = nil
    begin
      rs = Status.find(params[:status_id])
    rescue ActiveRecord::RecordNotFound
      Status.connection.stick_to_master!
      rs = Status.find(params[:status_id])
    end
    return rs unless rs.nil?
    raise ActiveRecord::RecordNotFound
  end

  def status_for_destroy
    current_user.account.statuses.where(reblog_of_id: params[:status_id]).first!
  end

  def reblog_params
    params.permit(:visibility, :status)
  end
end
