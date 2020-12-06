# frozen_string_literal: true

class ProcessHashtagsService < BaseService
  def call(status, tags = [])
    tags    = Extractor.extract_hashtags(status.text) + Extractor.extract_cashtags(status.text) if status.local?
    records = []

    tags.map { |str| str.mb_chars.downcase }.uniq(&:to_s).each do |name|
      tag = Tag.where(name: name).first_or_create(name: name)

      status.tags << tag
      records << tag
    end

    return unless status.public_visibility? || status.unlisted_visibility?
  end
end
