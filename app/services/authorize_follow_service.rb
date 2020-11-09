# frozen_string_literal: true

class AuthorizeFollowService < BaseService
  def call(source_account, target_account, **options)
    if options[:skip_follow_request]
      follow_request = FollowRequest.new(account: source_account, target_account: target_account, uri: options[:follow_request_uri])
    else
      follow_request = FollowRequest.find_by!(account: source_account, target_account: target_account)
      follow_request.authorize!
    end

    follow_request
  end
end
