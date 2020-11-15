# frozen_string_literal: true

class Api::V1::Groups::PasswordController < Api::BaseController
  
  include Authorization

  before_action :require_user!
  before_action :set_group

  def create
    authorize @group, :join?

    if params[:password] == @group.password
      if @group.is_private
        @group.join_requests << current_account
        render json: @group, serializer: REST::GroupRelationshipSerializer, relationships: relationships
      else
        @group.accounts << current_account
        render json: @group, serializer: REST::GroupRelationshipSerializer, relationships: relationships
      end
    else
      render json: { error: true, message: 'Invalid group password' }, status: 403
    end
  end

  private

  def set_group
    @group = Group.find(params[:group_id])
  end

  def relationships
    GroupRelationshipsPresenter.new([@group.id], current_user.account_id)
  end

end
