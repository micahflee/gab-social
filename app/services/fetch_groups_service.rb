# frozen_string_literal: true

class FetchGroupsService < BaseService
  def call(type)

    if type == "featured"
      body = Redis.current.with do |conn|
        conn.get("groups:featuredgroups")
      end
          
      if body.nil? || !body || body.empty?
        @groupIds = Group.where(is_featured: true, is_archived: false).limit(150).all.pluck(:id)
        
        Redis.current.with do |conn|
          conn.set("groups:featuredgroups", @groupIds.join(",")) 
        end
        Redis.current.with do |conn|
          conn.expire("groups:featuredgroups", 6.hours.seconds)
        end
        
        @groupIds
      else
        body.split(",")
      end
    end

  end
end
