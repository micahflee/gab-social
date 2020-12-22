# frozen_string_literal: true
# == Schema Information
#
# Table name: account_username_changes
#
#  id            :bigint(8)        not null, primary key
#  account_id    :bigint(8)        not null
#  from_username :text             default(""), not null
#  to_username   :text             default(""), not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

class AccountUsernameChange < ApplicationRecord

  belongs_to :account

end