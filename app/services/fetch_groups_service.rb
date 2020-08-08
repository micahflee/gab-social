# frozen_string_literal: true

class FetchGroupsService < BaseService
  def call(type)

    if type == "featured"
      body = Redis.current.get("groups:featuredgroups")
          
      if body.nil? || !body || body.empty?
        @groupIds = Group.where(is_featured: true, is_archived: false).limit(150).all.pluck(:id)
        
        Redis.current.set("groups:featuredgroups", @groupIds.join(",")) 
        Redis.current.expire("groups:featuredgroups", 6.hours.seconds)
        
        @groupIds
      else
        body.split(",")
      end
    end

  end
end
