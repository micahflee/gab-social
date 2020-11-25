# frozen_string_literal: true

class REST::StatusBookmarkedSerializer < ActiveModel::Serializer
  attributes :status_id, :account_id, :bookmarked

  def status_id
    object.id.to_s
  end

  def account_id
    current_user.account.id
  end

  def bookmarked
    if !current_user.nil?
      current_user.account.bookmarked?(object)
    else
      false
    end
  end

end
