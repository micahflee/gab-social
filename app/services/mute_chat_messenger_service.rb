# frozen_string_literal: true

class MuteChatMessengerService < BaseService
  def call(account, target_account)
    return if account.id == target_account.id
    mute = account.chat_mute!(target_account)
    mute
  end
end
