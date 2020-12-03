# frozen_string_literal: true

class ChatMessageLengthValidator < ActiveModel::Validator
  MAX_CHARS = 1600

  def validate(chatMessage)
    status.errors.add(:text, I18n.t('statuses.over_character_limit', max: MAX_CHARS)) if chatMessage.text.length > MAX_CHARS
    status.errors.add(:text, I18n.t('statuses.over_character_limit', max: MAX_CHARS)) if chatMessage.text.length === 0
  end
end
