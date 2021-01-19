# frozen_string_literal: true

class PreviewCardPolicy < ApplicationPolicy
  def destroy?
    staff?
  end

  def index?
    staff?
  end

  def show?
    staff?
  end
end
