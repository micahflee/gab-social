# frozen_string_literal: true

class Api::V1::PollsController < Api::BaseController
  before_action -> { authorize_if_got_token! :read, :'read:statuses' }, only: :show

  def show
    @poll = Poll.attached.find(params[:id])
    render json: @poll, serializer: REST::PollSerializer, include_results: true
  end
end
