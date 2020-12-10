# frozen_string_literal: true

class UnblockChatMessengerService < BaseService
  def call(account, target_account)
    return unless account.chat_blocking?(target_account)
    unblock = account.chat_unblock!(target_account)
    unblock
  end
end
