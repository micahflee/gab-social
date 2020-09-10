# frozen_string_literal: true

class REST::GroupRelationshipSerializer < ActiveModel::Serializer
  attributes :id, :member, :admin, :moderator, :requested

  def id
    object.id.to_s
  end

  def member
    instance_options[:relationships].member[object.id] ? true : false
  end

  def admin
    instance_options[:relationships].admin[object.id] ? true : false
  end

  def moderator
    instance_options[:relationships].moderator[object.id] ? true : false
  end

  def requested
    instance_options[:relationships].requested[object.id] ? true : false
  end

end
