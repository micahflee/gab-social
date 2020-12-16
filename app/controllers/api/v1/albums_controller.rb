# frozen_string_literal: true

class Api::V1::AlbumsController < Api::BaseController
  before_action :require_user!
  before_action :set_albums, only: :index
  before_action :set_album, only: [:show, :update, :destroy]

  def index
    render json: @albums, each_serializer: REST::AlbumSerializer
  end

  def create
    @album = "" #current_account.custom_filters.create!(resource_params)
    render json: @album, serializer: REST::AlbumSerializer
  end

  def show
    render json: @album, serializer: REST::AlbumSerializer
  end

  def update
    @album.update!(resource_params)
    render json: @album, serializer: REST::AlbumSerializer
  end

  def destroy
    @album.destroy!
    render_empty_success
  end

  private

  def set_albums
    @albums = "" #current_account.custom_filters
  end

  def set_album
    @album = "" # current_account.custom_filters.find(params[:id])
  end

  def resource_params
    params.permit(:title, :description, :visibility)
  end
end
