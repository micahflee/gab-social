# frozen_string_literal: true

require 'doorkeeper/grape/authorization_decorator'

class Rack::Attack
  class Request
    def remote_ip
      # @remote_ip ||= (@env["action_dispatch.remote_ip"] || ip).to_s
      # @env['HTTP_CF_CONNECTING_IP'] ? @env['HTTP_CF_CONNECTING_IP'] : ip
      @remote_ip ||= (@env["HTTP_CF_CONNECTING_IP"] || ip).to_s
    end
  end

  # Always allow requests from localhost
  # (blocklist & throttles are skipped)
  Rack::Attack.safelist('allow from localhost') do |req|
    # Requests are allowed if the return value is truthy
    req.remote_ip == '127.0.0.1' || req.remote_ip == '::1'
  end

end
