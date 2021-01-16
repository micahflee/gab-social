# frozen_string_literal: true
require 'sidekiq/api'

module Admin
  class DashboardController < BaseController
    def index
      @users_count           = User.count
      @statuses_count        = "." #Status.count
      @pro_accounts_count    = Account.where(is_pro: true).count
      @donor_accounts_count  = Account.where(is_donor: true).count
      Redis.current.with do |conn|
        @registrations_week    = conn.get("activity:accounts:local:#{current_week}") || 0
        @logins_week           = conn.pfcount("activity:logins:#{current_week}")
        @interactions_week     = conn.get("activity:interactions:#{current_week}") || 0
      end
      @single_user_mode      = Rails.configuration.x.single_user_mode
      @search_enabled        = Chewy.enabled?
      @version               = GabSocial::Version.to_s
      @database_version      = ActiveRecord::Base.connection.execute('SELECT VERSION()').first['version'].match(/\A(?:PostgreSQL |)([^\s]+).*\z/)[1]
      @redis_version         = redis_info['redis_version']
      @reports_count         = Report.unresolved.count
      @queue_backlog         = Sidekiq::Stats.new.enqueued
      @recent_users          = User.confirmed.recent.includes(:account).limit(4)
      @database_size         = ActiveRecord::Base.connection.execute('SELECT pg_database_size(current_database())').first['pg_database_size']
      @redis_size            = redis_info['used_memory']
      @ldap_enabled          = ENV['LDAP_ENABLED'] == 'true'
      @cas_enabled           = ENV['CAS_ENABLED'] == 'true'
      @saml_enabled          = ENV['SAML_ENABLED'] == 'true'
      @pam_enabled           = ENV['PAM_ENABLED'] == 'true'
      @hidden_service        = ENV['ALLOW_ACCESS_TO_HIDDEN_SERVICE'] == 'true'
    end

    private

    def current_week
      @current_week ||= Time.now.utc.to_date.cweek
    end

    def redis_info
      Redis.current.with do |conn|
        @redis_info ||= conn.info
      end
    end
  end
end
