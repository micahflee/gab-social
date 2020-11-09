# frozen_string_literal: true

class UnblockService < BaseService
  def call(account, target_account)
    return unless account.blocking?(target_account)

    unblock = account.unblock!(target_account)
    unblock
  end
end
