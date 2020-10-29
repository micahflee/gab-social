# frozen_string_literal: true

class Api::V1::LinksController < Api::BaseController
  before_action :require_user!
  before_action :set_link

  def show
    render json: @link, serializer: REST::PreviewCardSerializer
  end

  private

  def set_link
    @link = PreviewCard.find(params[:id])
  end

end
