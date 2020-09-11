# frozen_string_literal: true

class Api::V1::Groups::RequestsController < Api::BaseController
  include Authorization

  before_action -> { doorkeeper_authorize! :read, :'read:groups' }, only: [:show]
  before_action -> { doorkeeper_authorize! :write, :'write:groups' }, except: [:show]

  before_action :require_user!
  before_action :set_group

  after_action :insert_pagination_headers, only: :show

  def show
    @accounts = load_accounts
    render json: @accounts, each_serializer: REST::AccountSerializer
  end

  def respond_to_request
    if params[:type] === 'reject'
      GroupJoinRequest.where(group: @group, account_id: params[:accountId]).destroy_all
      render json: { message: "ok", type: 'reject', accountId: params[:accountId] }
    elsif params[:type] === 'approve'
      GroupJoinRequest.where(group: @group, account_id: params[:accountId]).destroy_all
      GroupAccount.create(group: @group, account_id: params[:accountId])
      render json: { message: "ok", type: 'approve', accountId: params[:accountId] }
    else
      render json: { message: "error", error: true }, status: 422
    end
  end

  private

  def set_group
    @group = Group.find(params[:group_id])
  end

  def load_accounts
    if unlimited?
      @group.join_requests.includes(:account_stat).all
    else
      @group.join_requests.includes(:account_stat).paginate_by_max_id(limit_param(DEFAULT_ACCOUNTS_LIMIT), params[:max_id], params[:since_id])
    end
  end

  def insert_pagination_headers
    set_pagination_headers(next_path, prev_path)
  end

  def next_path
    return if unlimited?

    if records_continue?
      api_v1_group_join_requests_url pagination_params(max_id: pagination_max_id)
    end
  end

  def prev_path
    return if unlimited?

    unless @accounts.empty?
      api_v1_group_join_requests_url pagination_params(since_id: pagination_since_id)
    end
  end

  def pagination_max_id
    @accounts.last.id
  end

  def pagination_since_id
    @accounts.first.id
  end

  def records_continue?
    @accounts.size == limit_param(DEFAULT_ACCOUNTS_LIMIT)
  end

  def pagination_params(core_params)
    params.slice(:limit).permit(:limit).merge(core_params)
  end

  def unlimited?
    params[:limit] == '0'
  end

  def group_account_params
    params.permit(:role, :write_permissions)
  end
end
