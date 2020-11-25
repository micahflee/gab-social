# frozen_string_literal: true

class REST::StatusPinnedSerializer < ActiveModel::Serializer
  attributes :status_id, :account_id, :pinned

  def status_id
    object.id.to_s
  end

  def account_id
    current_user.account.id
  end

  def pinned
    if !current_user.nil?
      current_user.account.pinned?(object)
    else
      false
    end
  end

end
