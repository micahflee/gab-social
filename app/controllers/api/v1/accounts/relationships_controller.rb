# frozen_string_literal: true

class Api::V1::Accounts::RelationshipsController < Api::BaseController
  before_action -> { doorkeeper_authorize! :read, :'read:follows' }
  before_action :require_user!

  def relationships
    accounts = Account.where(id: account_ids).select('id')
    # .where doesn't guarantee that our results are in the same order
    # we requested them, so return the "right" order to the requestor.
    @accounts = accounts.index_by(&:id).values_at(*account_ids).compact
    render json: @accounts, each_serializer: REST::RelationshipSerializer, relationships: get_relationships
  end

  private

  def get_relationships
    AccountRelationshipsPresenter.new(@accounts, current_user.account_id)
  end

  def account_ids
    the_take = current_user.staff? ? 100 : 25
    params[:accountIds].map(&:to_i).take(the_take)
  end
end
