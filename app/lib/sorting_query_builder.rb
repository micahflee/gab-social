# frozen_string_literal: true

class SortingQueryBuilder < BaseService
  def call(sort_type, group = nil, page = 1, account = nil)
    limit = 20

    min_likes = 5
    min_reblogs = 2
    min_replies = 1
    date_limit = 5.years.ago
    max_page = 8

    case sort_type
    when 'hot'
      date_limit = 8.hours.ago
    when 'top_today'
      date_limit = 24.hours.ago
    when 'top_weekly'
      date_limit = 7.days.ago
    when 'top_monthly'
      date_limit = 30.days.ago
    when 'top_yearly'
      date_limit = 1.year.ago
    end

    top_order = 'status_stats.favourites_count DESC, status_stats.reblogs_count DESC, status_stats.replies_count DESC'
    valid_sort_types = [
      'hot',
      'newest',
      'recent',
      'top_today',
      'top_weekly',
      'top_monthly',
      'top_yearly',
      'top_all_time',
    ]

    if page.to_i > max_page
      return []
    end

    if sort_type == 'newest'
      query = Status.without_replies.without_reblogs
      query = query.with_public_visibility if group.nil?
      query = query.where('statuses.created_at > ?', date_limit)
      query = query.where(group: group) unless group.nil?
      query = query.excluding_blocked_reblogs(account) unless account.nil?
      query = query.not_excluded_by_account(current_account) unless account.nil?
      query = query.page(page.to_i)
      query = query.per(limit)
      return query
    else
      query = StatusStat.where('status_stats.created_at > ?', date_limit)
      query = query.order(top_order) unless sort_type == 'recent'
      query = query.order(updated_at: :desc) if sort_type == 'recent'
      query = query.where('status_stats.replies_count > ?', min_replies) unless sort_type == 'recent'
      query = query.where('status_stats.reblogs_count > ?', min_reblogs) unless sort_type == 'recent'
      query = query.where('status_stats.favourites_count > ?', min_likes) unless sort_type == 'recent'
      query = query.joins(:status)
      query = query.excluding_blocked_reblogs(account) unless account.nil?
      query = query.not_excluded_by_account(current_account) unless account.nil?
      query = query.where('statuses.reblog_of_id IS NULL')
      query = query.where('statuses.in_reply_to_id IS NULL')
      query = query.where('statuses.group_id': group) unless group.nil?
      query = query.where('statuses.visibility': 0) if group.nil?
      query = query.page(page)
      query = query.per(limit)
      query = query.map(&:status)
      return query
    end
  end

end
