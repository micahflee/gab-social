# frozen_string_literal: true

class Api::V1::BookmarkCollectionsController < Api::BaseController
  before_action :require_user!
  before_action :set_bookmark_collections, only: :index
  before_action :set_bookmark_collection, only: [:show, :update, :destroy, :update_status]

  def index
    render json: @bookmark_collections, each_serializer: REST::StatusBookmarkCollectionSerializer
  end

  def create
    @bookmark_collection = current_account.status_bookmark_collections.create!(resource_params)
    render json: @bookmark_collection, serializer: REST::StatusBookmarkCollectionSerializer
  end

  def show
    render json: @bookmark_collection, serializer: REST::StatusBookmarkCollectionSerializer
  end

  def update
    @bookmark_collection.update!(resource_params)
    render json: @bookmark_collection, serializer: REST::StatusBookmarkCollectionSerializer
  end

  def destroy
    @bookmark_collection.destroy!
    render_empty_success
  end

  def update_status
    # 
  end

  private

  def set_bookmark_collections
    @bookmark_collections = current_account.status_bookmark_collections
  end

  def set_bookmark_collection
    @bookmark_collection = current_account.status_bookmark_collections.find(params[:id])
  end

  def resource_params
    params.permit(:title)
  end
end
