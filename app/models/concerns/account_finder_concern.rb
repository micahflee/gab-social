# frozen_string_literal: true

module AccountFinderConcern
  extend ActiveSupport::Concern

  class_methods do
    def find_local!(username)
      find_local(username) || raise(ActiveRecord::RecordNotFound)
    end

    def find_acct!(acct)
      find_acct(acct) || raise(ActiveRecord::RecordNotFound)
    end

    def representative
      find_local(Setting.site_contact_username.strip.gsub(/\A@/, '')) || Account.local.without_suspended.first
    end

    def find_local(username)
      find_now(username)
    end

    def find_acct(acct)
      find_now(acct)
    end

    def find_now(username)
      AccountFinder.new(username).account
    end
  end

  class AccountFinder
    attr_reader :username

    def initialize(username)
      @username = username
    end

    def account
      scoped_accounts.order(id: :asc).take
    end

    private

    def scoped_accounts
      Account.unscoped.tap do |scope|
        scope.merge! with_usernames
        scope.merge! matching_username
        scope.merge! matching_domain
      end
    end

    def with_usernames
      Account.where.not(username: '')
    end

    def matching_username
      Account.where(Account.arel_table[:username].lower.eq username.to_s.downcase)
    end

    def matching_domain
      Account.where(domain: nil)
    end
  end
end
