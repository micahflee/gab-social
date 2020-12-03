# frozen_string_literal: true
# == Schema Information
#
# Table name: chat_conversation_accounts
#
#  id                       :bigint(8)        not null, primary key
#  account_id               :bigint(8)
#  chat_conversation_id     :bigint(8)
#  participant_account_ids  :bigint(8)        default([]), not null, is an Array
#  last_chat_message_id     :bigint(8)
#  is_unread                :boolean          default(FALSE), not null
#  is_hidden                :boolean          default(FALSE), not null
#  is_approved              :boolean          default(FALSE), not null
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#

class ChatConversationAccount < ApplicationRecord
  include Paginable
  
  belongs_to :account
  belongs_to :chat_conversation
  belongs_to :last_chat_message, class_name: 'ChatMessage', optional: true

  # before_validation :set_last_chat_message

  def participant_accounts
    if participant_account_ids.empty?
      [account]
    else
      # : todo : dont include current_account
      participants = Account.where(id: participant_account_ids)
      participants.empty? ? [account] : participants
    end
  end

  private

  def set_last_chat_message
    self.last_chat_message_id = nil # : todo :
  end

end
