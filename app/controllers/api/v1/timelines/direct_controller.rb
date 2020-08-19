# frozen_string_literal: true

class Api::V1::Timelines::DirectController < Api::BaseController
  before_action :require_admin!
  respond_to :json

  def show
    render json: [-1]
  end

end
