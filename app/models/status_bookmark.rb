# frozen_string_literal: true
# == Schema Information
#
# Table name: status_bookmarks
#
#  id         :integer          not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  account_id :integer          not null
#  status_id  :integer          not null
#

class StatusBookmark < ApplicationRecord
  include Paginable

  belongs_to :account, inverse_of: :status_bookmarks
  belongs_to :status,  inverse_of: :status_bookmarks

  validates :status_id, uniqueness: { scope: :account_id }

  before_validation do
    self.status = status.reblog if status&.reblog?
  end
end