# frozen_string_literal: true

module AccountAssociations
  extend ActiveSupport::Concern

  included do
    # Local users
    has_one :user, inverse_of: :account, dependent: :destroy

    # Chat
    has_many :chat_messages, inverse_of: :account, dependent: :destroy
    has_many :chat_conversation_accounts, inverse_of: :account, dependent: :destroy

    # Timelines
    has_many :statuses, inverse_of: :account, dependent: :destroy
    has_many :favourites, inverse_of: :account, dependent: :destroy
    has_many :mentions, inverse_of: :account, dependent: :destroy
    has_many :notifications, inverse_of: :account, dependent: :destroy
    has_many :scheduled_statuses, inverse_of: :account, dependent: :destroy

    # Bookmarked statuses
    has_many :status_bookmarks, inverse_of: :account, dependent: :destroy
    has_many :bookmarked_statuses, -> { reorder('status_bookmarks.created_at DESC') }, through: :status_bookmarks, class_name: 'Status', source: :status
    has_many :status_bookmark_collections, inverse_of: :account, dependent: :destroy

    # Pinned statuses
    has_many :status_pins, inverse_of: :account, dependent: :destroy
    has_many :pinned_statuses, -> { reorder('status_pins.created_at DESC') }, through: :status_pins, class_name: 'Status', source: :status

    # Media
    has_many :media_attachments, dependent: :destroy
    has_many :polls, dependent: :destroy

    # Push subscriptions
    has_many :subscriptions, dependent: :destroy

    # Report relationships
    has_many :reports, dependent: :destroy, inverse_of: :account
    has_many :targeted_reports, class_name: 'Report', foreign_key: :target_account_id, dependent: :destroy, inverse_of: :target_account

    has_many :report_notes, dependent: :destroy
    has_many :custom_filters, inverse_of: :account, dependent: :destroy

    # Moderation notes
    has_many :account_moderation_notes, dependent: :destroy, inverse_of: :account
    has_many :targeted_moderation_notes, class_name: 'AccountModerationNote', foreign_key: :target_account_id, dependent: :destroy, inverse_of: :target_account
    has_many :account_warnings, dependent: :destroy, inverse_of: :account
    has_many :targeted_account_warnings, class_name: 'AccountWarning', foreign_key: :target_account_id, dependent: :destroy, inverse_of: :target_account

    # Lists (that the account is on, not owned by the account)
    has_many :list_accounts, inverse_of: :account, dependent: :destroy
    has_many :lists, through: :list_accounts

    # Lists (owned by the account)
    has_many :owned_lists, class_name: 'List', dependent: :destroy, inverse_of: :account

    # Account migrations
    belongs_to :moved_to_account, class_name: 'Account', optional: true

    # Hashtags
    has_and_belongs_to_many :tags

    # Billing
    has_many :transactions, class_name: 'Transaction', dependent: :destroy, inverse_of: :account
  end
end
