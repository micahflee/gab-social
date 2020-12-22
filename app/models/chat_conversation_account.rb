# frozen_string_literal: true
# == Schema Information
#
# Table name: chat_conversation_accounts
#
#  id                             :bigint(8)        not null, primary key
#  account_id                     :bigint(8)
#  chat_conversation_id           :bigint(8)
#  participant_account_ids        :bigint(8)        default([]), not null, is an Array
#  last_chat_message_id           :bigint(8)
#  is_hidden                      :boolean          default(FALSE), not null
#  is_approved                    :boolean          default(FALSE), not null
#  created_at                     :datetime         not null
#  updated_at                     :datetime         not null
#  unread_count                   :bigint(8)        default(0), not null
#  chat_message_expiration_policy :string
#  is_muted                       :boolean          default(FALSE), not null
#

# : todo : max per account
class ChatConversationAccount < ApplicationRecord
  include Paginable

  EXPIRATION_POLICY_MAP = {
    none: nil,
    five_minutes: '1',
    one_hour: '2',
    six_hours: '3',
    one_day: '4',
    three_days: '5',
    one_week: '6',
  }.freeze

  belongs_to :account
  belongs_to :chat_conversation
  belongs_to :last_chat_message, class_name: 'ChatMessage', optional: true

  def participant_accounts
    if participant_account_ids.empty?
      [account]
    else
      participants = Account.where(id: participant_account_ids)
      participants.empty? ? [account] : participants
    end
  end

  private

end
