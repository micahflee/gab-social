# frozen_string_literal: true
# == Schema Information
#
# Table name: chat_messages
#
#  id                     :bigint(8)        not null, primary key
#  account_id             :bigint(8)        not null
#  chat_conversation_id   :bigint(8)        not null
#  text                   :text             default(""), not null
#  language               :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#

class ChatMessage < ApplicationRecord
  include Paginable
  
  belongs_to :from_account, class_name: 'Account'
  belongs_to :chat_conversation

  validates_with ChatMessageLengthValidator
  
  default_scope { recent }

  scope :recent, -> { reorder(created_at: :desc) }

end
