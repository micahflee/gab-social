# frozen_string_literal: true

class RejectFollowService < BaseService
  def call(source_account, target_account)
    follow_request = FollowRequest.find_by!(account: source_account, target_account: target_account)
    follow_request.reject!
    follow_request
  end
end
