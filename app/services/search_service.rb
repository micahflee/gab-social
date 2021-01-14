# frozen_string_literal: true

class SearchService < BaseService
  def call(query, account, limit, options = {})
    @query   = query&.strip
    @account = account
    @account = account
    @options = options
    if @account.user.staff?
      @limit = 100
    else
      @limit = limit.to_i
    end
    @offset  = options[:type].blank? ? 0 : options[:offset].to_i
    @resolve = options[:resolve] || false
    @onlyVerified = options[:onlyVerified] || false

    default_results.tap do |results|
      next if @query.blank? || @limit.zero?

      if @query.present?
        results[:accounts] = perform_accounts_search! if account_searchable?
        results[:statuses] = perform_statuses_search! if full_text_searchable? && @account.user.staff?
        results[:links] = perform_links_search! if @account.user.staff?
        results[:groups] = perform_groups_search!
      end
    end
  end

  private

  def perform_accounts_search!
    AccountSearchService.new.call(
      @query,
      @account,
      limit: @limit,
      resolve: @resolve,
      offset: @offset,
      onlyVerified: @onlyVerified
    )
  end

  def perform_groups_search!
    Group.search_for(
      @query.gsub(/\A#/, ''),
      @offset
    )
  end

  def perform_links_search!
    PreviewCard.search_for(
      @query.gsub(/\A#/, ''),
      @offset
    )
  end

  def perform_statuses_search!
    definition = StatusesIndex.filter(term: { searchable_by: @account.id })
                              .query(multi_match: { type: 'most_fields', query: @query, operator: 'and', fields: %w(text text.stemmed) })

    if @options[:account_id].present?
      definition = definition.filter(term: { account_id: @options[:account_id] })
    end

    if @options[:min_id].present? || @options[:max_id].present?
      range      = {}
      range[:gt] = @options[:min_id].to_i if @options[:min_id].present?
      range[:lt] = @options[:max_id].to_i if @options[:max_id].present?
      definition = definition.filter(range: { id: range })
    end

    results             = definition.limit(@limit).offset(@offset).objects.compact
    account_ids         = results.map(&:account_id)
    account_domains     = results.map(&:account_domain)
    preloaded_relations = relations_map_for_account(@account, account_ids, account_domains)

    results.reject { |status| StatusFilter.new(status, @account, preloaded_relations).filtered? }
  rescue Faraday::ConnectionFailed
    []
  end

  def default_results
    { accounts: [], statuses: [], links: [], groups: [] }
  end

  def full_text_searchable?
    return false unless Chewy.enabled?

    statuses_search? && !@account.nil? && !((@query.start_with?('#') || @query.include?('@')) && !@query.include?(' '))
  end

  def account_searchable?
    account_search? && !(@query.include?('@') && @query.include?(' '))
  end

  def account_search?
    @options[:type].blank? || @options[:type] == 'accounts'
  end

  def statuses_search?
    @options[:type].blank? || @options[:type] == 'statuses'
  end

  def relations_map_for_account(account, account_ids, domains)
    {
      blocking: Account.blocking_map(account_ids, account.id),
      blocked_by: Account.blocked_by_map(account_ids, account.id),
      muting: Account.muting_map(account_ids, account.id),
      following: Account.following_map(account_ids, account.id),
    }
  end
end
