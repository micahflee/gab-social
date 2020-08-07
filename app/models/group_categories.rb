# == Schema Information
#
# Table name: group_categories
#
#  id         :bigint(8)        not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  text       :string           default(""), not null
#

class GroupCategories < ApplicationRecord
end
