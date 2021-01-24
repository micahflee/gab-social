# frozen_string_literal: true

class FavouriteService < BaseService
  include Authorization

  # Favourite a status and notify remote user
  # @param [Account] account
  # @param [Status] status
  # @return [Favourite]
  def call(account, status)
    authorize_with account, status, :favourite?

    favourite = Favourite.find_by(account: account, status: status)

    return favourite unless favourite.nil?

    favourite = Favourite.create!(account: account, status: status)

    create_notification(favourite)
    bump_potential_friendship(account, status)

    favourite
  end

  private

  def create_notification(favourite)
    status = favourite.status

    if status.account.local?
      NotifyService.new.call(status.account, favourite)
    end
  end

  def bump_potential_friendship(account, status)
    ActivityTracker.increment('activity:interactions')
    return if account.following?(status.account_id)
    PotentialFriendshipTracker.record(account.id, status.account_id, :favourite)
  end

end
