# frozen_string_literal: true

class Api::V1::Statuses::BookmarksController < Api::BaseController
  include Authorization

  before_action -> { doorkeeper_authorize! :write, :'write:bookmarks' }
  before_action :require_user!

  def create
    if current_user.account.is_pro
      @status = bookmarked_status
      render json: @status, serializer: REST::StatusBookmarkedSerializer
    else
      render json: { error: 'You need to be a GabPRO member to access this' }, status: 422
    end
  end

  def show
    @status = requested_status
    render json: @status, serializer: REST::StatusBookmarkedSerializer 
  end

  def destroy
    if current_user.account.is_pro
      @status = requested_status
      @bookmarks_map = { @status.id => false }

      bookmark = StatusBookmark.find_by!(account: current_user.account, status: @status)
      bookmark.destroy!

      render json: @status, serializer: REST::StatusBookmarkedSerializer
    else
      render json: { error: 'You need to be a GabPRO member to access this' }, status: 422
    end
  end

  private

  def bookmarked_status
    authorize_with current_user.account, requested_status, :show?

    bookmark = StatusBookmark.find_or_create_by!(account: current_user.account, status: requested_status)

    bookmark.status.reload
  end

  def requested_status
    Status.find(params[:status_id])
  end
end