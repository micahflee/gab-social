# == Schema Information
#
# Table name: group_join_requests
#
#  id         :bigint(8)        not null, primary key
#  account_id :bigint(8)        not null
#  group_id   :bigint(8)        not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class GroupJoinRequest < ApplicationRecord
  belongs_to :group
  belongs_to :account

  validates :account_id, uniqueness: { scope: :group_id }
end
