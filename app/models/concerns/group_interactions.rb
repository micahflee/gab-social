# frozen_string_literal: true

module GroupInteractions
  extend ActiveSupport::Concern

  class_methods do

    def member_map(target_group_ids, account_id)
      follow_mapping(GroupAccount.where(group_id: target_group_ids, account_id: account_id), :group_id)
    end

    def admin_map(target_group_ids, account_id)
      follow_mapping(GroupAccount.where(group_id: target_group_ids, account_id: account_id, role: :admin), :group_id)
    end

    private

    def follow_mapping(query, field)
      query.pluck(field).each_with_object({}) { |id, mapping| mapping[id] = true }
    end

  end

  def accounts_for_local_distribution
    accounts.local
      .joins(:user)
      .where('users.current_sign_in_at > ?', User::ACTIVE_DURATION.ago)
      .where('users.id NOT IN (SELECT thing_id FROM settings WHERE thing_type = \'User\' AND var = \'group_in_home_feed\' AND value = \'--- false
\')')
  end

end
