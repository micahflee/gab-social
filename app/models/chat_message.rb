# frozen_string_literal: true
# == Schema Information
#
# Table name: chat_messages
#
#  id                   :bigint(8)        not null, primary key
#  text                 :text             default(""), not null
#  language             :text             default(""), not null
#  from_account_id      :integer          not null
#  chat_conversation_id :integer          not null
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  expires_at           :datetime
#

class ChatMessage < ApplicationRecord
  include Paginable
  
  belongs_to :from_account, class_name: 'Account'
  belongs_to :chat_conversation

  validates_with ChatMessageLengthValidator
  
  default_scope { recent }

  scope :expired, -> { where.not(expires_at: nil).where('expires_at < ?', Time.now.utc) }
  scope :recent, -> { reorder(created_at: :desc) }

  def emojis
    return @emojis if defined?(@emojis)

    @emojis = CustomEmoji.from_text(text)
  end
end
