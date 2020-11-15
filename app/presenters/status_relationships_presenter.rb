# frozen_string_literal: true

class StatusRelationshipsPresenter
  attr_reader :reblogs_map, :favourites_map, :group_pins_map

  def initialize(statuses, current_account_id = nil, **options)
    if current_account_id.nil?
      @reblogs_map = {}
      @favourites_map = {}
    else
      statuses = statuses.compact
      status_ids = statuses.flat_map { |s| [s.id, s.reblog_of_id, s.quote_of_id] }.uniq.compact

      @reblogs_map = Status.reblogs_map(status_ids, current_account_id).merge(options[:reblogs_map] || {})
      @favourites_map  = Status.favourites_map(status_ids, current_account_id).merge(options[:favourites_map] || {})
    end
  end
end
