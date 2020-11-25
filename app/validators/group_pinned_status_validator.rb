# frozen_string_literal: true

class GroupPinnedStatusValidator < ActiveModel::Validator
  def validate(groupPin)
    groupPin.errors.add(:base, I18n.t('statuses.group_pin_errors.reblog')) if groupPin.status.reblog?
    groupPin.errors.add(:base, I18n.t('statuses.group_pin_errors.ungrouped')) unless groupPin.status.group_id
    groupPin.errors.add(:base, I18n.t('statuses.group_pin_errors.notGroupStatus')) if groupPin.status.group_id != groupPin.group.id
    groupPin.errors.add(:base, I18n.t('statuses.group_pin_errors.limit')) if groupPin.group.group_pinned_statuses.count >= 4
  end
end
