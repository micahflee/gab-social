# frozen_string_literal: true

require 'doorkeeper/grape/authorization_decorator'

class Rack::Attack
  class Request
    def authenticated_token
      return @token if defined?(@token)

      @token = Doorkeeper::OAuth::Token.authenticate(
        Doorkeeper::Grape::AuthorizationDecorator.new(self),
        *Doorkeeper.configuration.access_token_methods
      )
    end

    def remote_ip
      # @remote_ip ||= (@env["action_dispatch.remote_ip"] || ip).to_s
      # @env['HTTP_CF_CONNECTING_IP'] ? @env['HTTP_CF_CONNECTING_IP'] : ip
      @remote_ip ||= (@env["HTTP_CF_CONNECTING_IP"] || ip).to_s
    end

    def authenticated_user_id
      authenticated_token&.resource_owner_id
    end

    def unauthenticated?
      !authenticated_user_id
    end

    def api_request?
      path.start_with?('/api')
    end

    def web_request?
      !api_request?
    end

    def paging_request?
      params['page'].present? || params['min_id'].present? || params['max_id'].present? || params['since_id'].present?
    end
  end

  # Always allow requests from localhost
  # (blocklist & throttles are skipped)
  Rack::Attack.safelist('allow from localhost') do |req|
    # Requests are allowed if the return value is truthy
    req.remote_ip == '127.0.0.1' || req.remote_ip == '::1'
  end

  # Rate limit API requests by authenticated users
  throttle('throttle_authenticated_api', limit: 300, period: 5.minutes) do |req|
    req.authenticated_user_id if req.api_request?
  end

  # Rate limit API requests by UN-authenticated users
  throttle('throttle_unauthenticated_api', limit: 150, period: 5.minutes) do |req|
    req.remote_ip if req.api_request? && req.unauthenticated?
  end

  # Rate limit API requests for submitting a media attachment
  throttle('throttle_api_media', limit: 30, period: 30.minutes) do |req|
    req.authenticated_user_id if req.post? && req.path.start_with?('/api/v1/media')
  end

  # Rate limit requests for using media_proxy route
  throttle('throttle_media_proxy', limit: 30, period: 30.minutes) do |req|
    req.remote_ip if req.path.start_with?('/media_proxy')
  end

  # Rate limit sign up route
  throttle('throttle_api_sign_up', limit: 5, period: 30.minutes) do |req|
    req.remote_ip if req.post? && req.path == '/api/v1/accounts'
  end

  # Rate limit API search route
  throttle('throttle_api_search', limit: 60, period: 10.minutes) do |req|
    req.remote_ip if req.post? && req.path == '/api/v2/search'
  end

  # Throttle paging, as it is mainly used for public pages and AP collections
  throttle('throttle_authenticated_paging', limit: 300, period: 15.minutes) do |req|
    req.authenticated_user_id if req.paging_request?
  end

  # Rate limit paging requests (e.g. scrolling down explore/group timelines)
  throttle('throttle_unauthenticated_paging', limit: 300, period: 15.minutes) do |req|
    req.remote_ip if req.paging_request? && req.unauthenticated?
  end

  # Rate limit API route for deleting a status
  API_DELETE_REBLOG_REGEX = /\A\/api\/v1\/statuses\/[\d]+\/unreblog/.freeze
  API_DELETE_STATUS_REGEX = /\A\/api\/v1\/statuses\/[\d]+/.freeze
  throttle('throttle_api_delete', limit: 30, period: 30.minutes) do |req|
    req.authenticated_user_id if (req.post? && req.path =~ API_DELETE_REBLOG_REGEX) || (req.delete? && req.path =~ API_DELETE_STATUS_REGEX)
  end

  # Rate limit API route creating a conversation
  API_POST_CHAT_CONVERSATION_REGEX = /\A\/api\/v1\/chat_conversation/.freeze
  throttle('throttle_api_chat_conversation', limit: 20, period: 1.day) do |req|
    req.authenticated_user_id if req.post? && req.path =~ API_POST_CHAT_CONVERSATION_REGEX
  end

  # Rate limit API route sending a chat message
  API_POST_CHAT_MESSAGE_REGEX = /\A\/api\/v1\/chat_messages/.freeze
  throttle('throttle_api_chat_message', limit: 1000, period: 1.day) do |req|
    req.authenticated_user_id if req.post? && req.path =~ API_POST_CHAT_MESSAGE_REGEX
  end

  # Rate limit API route for following someone
  API_POST_FOLLOW_REGEX = /\A\/api\/v1\/accounts\/[\d]+\/follow/.freeze
  throttle('throttle_api_follow', limit: 200, period: 1.day) do |req|
    req.authenticated_user_id if req.post? && req.path =~ API_POST_FOLLOW_REGEX
  end

  # Rate limit API route for checking if a password to a group is correct
  API_POST_GROUP_PASSWORD_CHECK_REGEX = /\A\/api\/v1\/groups\/[\d]+\/password/.freeze
  throttle('throttle_group_password_check', limit: 5, period: 1.minute) do |req|
    req.authenticated_user_id if req.post? && req.path =~ API_POST_GROUP_PASSWORD_CHECK_REGEX
  end

  PROTECTED_PATHS = %w(
    /auth/sign_in
    /auth
    /auth/password
    /auth/confirmation
  ).freeze
  # Rate limit protected paths (auth for sign in, password, email confirmation)
  PROTECTED_PATHS_REGEX = Regexp.union(PROTECTED_PATHS.map { |path| /\A#{Regexp.escape(path)}/ })
  throttle('protected_paths', limit: 10, period: 5.minutes) do |req|
    req.remote_ip if req.post? && req.path =~ PROTECTED_PATHS_REGEX
  end

  self.throttled_response = lambda do |env|
    now        = Time.now.utc
    match_data = env['rack.attack.match_data']

    headers = {
      'Content-Type'          => 'application/json',
      'X-RateLimit-Limit'     => match_data[:limit].to_s,
      'X-RateLimit-Remaining' => '0',
      'X-RateLimit-Reset'     => (now + (match_data[:period] - now.to_i % match_data[:period])).iso8601(6),
    }

    [429, headers, [{ error: I18n.t('errors.429') }.to_json]]
  end
end
