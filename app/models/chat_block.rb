# frozen_string_literal: true
# == Schema Information
#
# Table name: chat_blocks
#
#  id                :bigint(8)        not null, primary key
#  account_id        :integer          not null
#  target_account_id :integer          not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#

class ChatBlock < ApplicationRecord
  include Paginable
  include RelationshipCacheable

  belongs_to :account
  belongs_to :target_account, class_name: 'Account'

  validates :account_id, uniqueness: { scope: :target_account_id }

  after_commit :remove_blocking_cache

  private

  def remove_blocking_cache
    Rails.cache.delete("exclude_chat_account_ids_for:#{account_id}")
    Rails.cache.delete("exclude_chat_account_ids_for:#{target_account_id}")
  end
end
