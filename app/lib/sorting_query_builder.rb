# frozen_string_literal: true

class SortingQueryBuilder < BaseService  
  def call(sort_type, max_id = nil, group = nil)
    min_likes = 20
    min_reblogs = 10
    min_replies = 2
    date_limit = 30.days.ago

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

    query = Status.unscoped.without_replies
    query = query.joins(:status_stat).order(top_order) unless ['newest'].include? sort_type
    query = query.where('statuses.created_at > ?', date_limit)
    query = query.where(group: group) unless group.nil?
    query = query.where('statuses.id > ? AND statuses.id <> ?', max_id, max_id) unless max_id.nil? || max_id.empty?
    query = query.limit(20)
    
    # SELECT  "statuses".*
    # FROM "statuses"
    # INNER JOIN "status_stats" ON "status_stats"."status_id" = "statuses"."id" 
    # WHERE (statuses.reply IS FALSE) AND (statuses.created_at > '2020-11-02 22:01:36.197805') 
    # ORDER BY "statuses"."created_at" DESC, status_stats.favourites_count DESC, status_stats.reblogs_count DESC, status_stats.replies_count DESC LIMIT $1

    query
  end

end
