# frozen_string_literal: true

module LinkNormalizable
  extend ActiveSupport::Concern

  included do
    before_validation :normalize_link
  end

  private

  def normalize_link
    self.link = TagManager.instance.normalize_link(link&.strip)
  end
end
