# frozen_string_literal: true

class HomeFeed < Feed
  def initialize(account)
    @type    = :home
    @id      = account.id
    @account = account
  end

  def get(limit = 20, max_id = nil, since_id = nil, min_id = nil)
    from_database(limit, max_id, since_id, min_id)
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
        left join statuses reblog
          on s.reblog_of_id = reblog.id
        where
          s.created_at > NOW() - INTERVAL '7 days'
          and s.reply is false
          and (
            s.account_id = #{@id}
            or s.account_id in (
              select ff.target_account_id
              from follows ff
              join accounts af
              on ff.target_account_id = af.id
              where ff.account_id = #{@id})
          )
          and s.account_id not in (select target_account_id from mutes where account_id = #{@id})
          and (reblog.id is null or reblog.account_id not in (select target_account_id from mutes where account_id = #{@id}))
          and (reblog.id is null or reblog.account_id not in (select target_account_id from blocks where account_id = #{@id}))
          #{pagination_max}
          #{pagination_min}
        order by s.created_at desc
        limit #{limit}
      ) st
    "
  end
end
