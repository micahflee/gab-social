# frozen_string_literal: true

class Api::V1::AlbumListsController < Api::BaseController
  before_action :require_user!

  before_action :set_account, only: [:show]
  after_action :insert_pagination_headers, only: :show

  def show
    @albums = load_albums
    render json: @albums, each_serializer: REST::AlbumSerializer
  end

  private

  def load_albums
    paginated_albums
  end

  def paginated_albums
    @paginated_albums = MediaAttachmentAlbum.where(account: @account)
                                  .paginate_by_max_id(
                                    limit_param(DEFAULT_ACCOUNTS_LIMIT),
                                    params[:max_id],
                                    params[:since_id]
                                  )
  end

  def insert_pagination_headers
    set_pagination_headers(next_path, prev_path)
  end

  def next_path
    if records_continue?
      api_v1_album_list_url params[:id], pagination_params(max_id: pagination_max_id)
    end
  end

  def prev_path
    unless paginated_albums.empty?
      api_v1_album_list_url params[:id], pagination_params(since_id: pagination_since_id)
    end
  end

  def pagination_max_id
    paginated_albums.last.id
  end

  def pagination_since_id
    paginated_albums.first.id
  end

  def records_continue?
    paginated_albums.size == limit_param(DEFAULT_ACCOUNTS_LIMIT)
  end

  def pagination_params(core_params)
    params.slice(:limit).permit(:limit).merge(core_params)
  end

  def set_account
    @account = Account.find(params[:id])
  end

end
