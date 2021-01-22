# frozen_string_literal: true

class HomeFeed < Feed
  def initialize(account)
    @type    = :home
    @id      = account.id
    @account = account
  end

  def get(limit = 20, max_id = nil, since_id = nil, min_id = nil)
    # if redis.exists?("account:#{@account.id}:regeneration")
    from_database(limit, max_id, since_id, min_id)
    # else
    #   super
    # end
  end

  private

  def from_database(limit, max_id, since_id, min_id)
    pagination_max = ""
    pagination_min = ""
    pagination_max = "and s.id < #{max_id}" unless max_id.nil?
    pagination_min = "and s.id > #{min_id}" unless min_id.nil?
    Status.find_by_sql "
      select st.* from (
        select s.*
        from statuses s
        where
          s.created_at > NOW() - INTERVAL '7 days'
          and s.reply is false
          and (
            s.account_id = #{@id}
            or s.account_id in (select target_account_id from follows where account_id = #{@id})
          )
          and s.account_id not in (select target_account_id from mutes where account_id = #{@id})
          #{pagination_max}
          #{pagination_min}
        order by s.created_at desc
        limit #{limit}
      ) st
      left join custom_filters cf
        on cf.account_id = #{@id} and st.text not like '%' || cf.phrase || '%'
      where cf.id is null
    "
    # .reject { |status| FeedManager.instance.filter?(:home, status, @account.id) }
    # Status.as_home_timeline(@account)
    #      .paginate_by_id(limit, max_id: max_id, since_id: since_id, min_id: min_id)
  end
end
