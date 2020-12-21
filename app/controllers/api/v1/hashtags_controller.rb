# frozen_string_literal: true

class Api::V1::HashtagsController < Api::BaseController
  before_action :require_user!
  before_action :set_hashtag

  def show
    render json: @hashtag, serializer: REST::TagSerializer
  end

  private

  def set_hashtag
    @hashtag = Tag.where(name: params[:id]).first
  end

end
