# frozen_string_literal: true

class REST::StatusStatSerializer < ActiveModel::Serializer
  attributes :status_id, :replies_count, :reblogs_count, :favourites_count

  attribute :favourited, if: :current_user?
  attribute :reblogged, if: :current_user?

  def status_id
    object.id.to_s
  end

  def favourited
    if instance_options && instance_options[:relationships]
      instance_options[:relationships].favourites_map[object.id] || false
    else
      current_user.account.favourited?(object)
    end
  end

  def favourites_count
    if instance_options && instance_options[:unfavourite]
      object.favourites_count - 1
    else
      object.favourites_count
    end
  end

  def reblogged
    if instance_options && instance_options[:relationships]
      instance_options[:relationships].reblogs_map[object.id] || false
    else
      current_user.account.reblogged?(object)
    end
  end

  def reblogs_count
    if instance_options && instance_options[:unreblog]
      object.reblogs_count - 1
    else
      object.reblogs_count
    end
  end

  def current_user?
    !current_user.nil?
  end

end
