# frozen_string_literal: true
# == Schema Information
#
# Table name: shortcuts
#
#  id               :bigint(8)        not null, primary key
#  account_id       :bigint(8)        not null
#  shortcut_id      :bigint(8)        not null
#  shortcut_type    :string           not null
#  created_at       :datetime         not null
#  updated_at       :datetime
#

class Shortcut < ApplicationRecord
  
end
