# frozen_string_literal: true
# == Schema Information
#
# Table name: group_pinned_statuses
#
#  id        :bigint(8)        not null, primary key
#  status_id :bigint(8)        not null
#  group_id  :bigint(8)        not null
#

class GroupPinnedStatus < ApplicationRecord
  belongs_to :group
  belongs_to :status

  validates_with GroupPinnedStatusValidator
end
