# frozen_string_literal: true

class StatusFilter
  attr_reader :status, :account, :params

  def initialize(status, account, preloaded_relations = {}, params)
    @status              = status
    @account             = account
    @preloaded_relations = preloaded_relations
    @params = params
  end

  def filtered?
    return false if !account.nil? && account.id == status.account_id
    blocked_by_policy? || (account_present? && filtered_status?) || silenced_account?
  end

  def results
    scope = Status
    params.each do |key, value|
      scope = scope.merge scope_for(key, value) if !value.nil? && !value.empty?
    end
    scope
  end

  private

  def scope_for(key, value)
    case key.to_sym
    when :text
      Status.where("LOWER(text) LIKE LOWER(?)", "%#{value}%")
    when :id
      Status.where(id: value)
    when :account_id
      Status.where(account_id: value)
    when :group_id
      Status.where(group_id: value)
    when :preview_card_id
      Status.joins(:preview_cards).where("preview_cards.id = #{value.to_i}")
    when :created_at_lte
      Status.where("created_at <= ?", value)
    when :created_at_gte
      Status.where("created_at >= ?", value)
    else
      raise "Unknown filter: #{key}"
    end
  end

  def account_present?
    !account.nil?
  end

  def filtered_status?
    blocking_account? || muting_account?
  end

  def blocking_account?
    @preloaded_relations[:blocking] ? @preloaded_relations[:blocking][status.account_id] : account.blocking?(status.account_id)
  end

  def muting_account?
    @preloaded_relations[:muting] ? @preloaded_relations[:muting][status.account_id] : account.muting?(status.account_id)
  end

  def silenced_account?
    !account&.silenced? && status_account_silenced? && !account_following_status_account?
  end

  def status_account_silenced?
    status.account.silenced?
  end

  def account_following_status_account?
    @preloaded_relations[:following] ? @preloaded_relations[:following][status.account_id] : account&.following?(status.account_id)
  end

  def blocked_by_policy?
    !policy_allows_show?
  end

  def policy_allows_show?
    StatusPolicy.new(account, status, @preloaded_relations).show?
  end
end
