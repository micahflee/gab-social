# frozen_string_literal: true

class Api::V1::GroupRelationshipsController < Api::BaseController
  before_action -> { doorkeeper_authorize! :read, :'read:groups' }
  before_action :require_user!

  def relationships
    groups = Group.where(id: group_ids, is_archived: false).select('id')
    # .where doesn't guarantee that our results are in the same order
    # we requested them, so return the "right" order to the requestor.
    @groups = groups.index_by(&:id).values_at(*group_ids).compact
    render json: @groups, each_serializer: REST::GroupRelationshipSerializer, relationships: get_relationships
  end

  private

  def get_relationships
    GroupRelationshipsPresenter.new(@groups, current_user.account_id)
  end

  def group_ids
    the_take = current_user.staff? ? 100 : 25
    params[:groupIds].map(&:to_i).take(the_take)
  end
end
