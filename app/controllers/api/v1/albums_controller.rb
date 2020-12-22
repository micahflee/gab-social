# frozen_string_literal: true

class Api::V1::AlbumsController < Api::BaseController
  before_action :require_user!

  before_action :set_album, only: [:show, :update, :destroy]

  def create
    @album = current_account.media_attachment_albums.create!(resource_params)
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

  def set_album
    @album = current_account.media_attachment_albums.find(params[:id])
  end

  def resource_params
    params.permit(:title, :description)
  end
end
