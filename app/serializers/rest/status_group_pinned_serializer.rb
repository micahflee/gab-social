# frozen_string_literal: true

class REST::StatusGroupPinnedSerializer < ActiveModel::Serializer
  attributes :status_id, :group_id, :pinned_by_group

  def status_id
    object.id.to_s
  end

  def group_id
    instance_options[:group_id]
  end

  def pinned_by_group
    if !current_user.nil? || !group_id
      !GroupPinnedStatus.where(status_id: status_id, group_id: group_id).empty?
    else
      false
    end
  end

end
