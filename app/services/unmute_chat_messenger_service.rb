# frozen_string_literal: true

class UnmuteChatMessengerService < BaseService
  def call(account, target_account)
    return unless account.chat_muting?(target_account)
    account.chat_unmute!(target_account)
  end
end
