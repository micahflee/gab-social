# frozen_string_literal: true

class REST::GroupCategoriesSerializer < ActiveModel::Serializer
  attributes :id, :text, :created_at

  def id
    object.id.to_s
  end
end
