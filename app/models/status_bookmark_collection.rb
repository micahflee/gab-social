# frozen_string_literal: true
# == Schema Information
#
# Table name: status_bookmark_collections
#
#  id         :bigint(8)        not null, primary key
#  title      :text             default(""), not null
#  account_id :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class StatusBookmarkCollection < ApplicationRecord

  PER_ACCOUNT_LIMIT = 150

  belongs_to :account, inverse_of: :status_bookmark_collections
  
end
