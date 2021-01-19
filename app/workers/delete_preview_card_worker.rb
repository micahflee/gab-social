# frozen_string_literal: true

class DeletePreviewCardWorker
  include Sidekiq::Worker

  sidekiq_options unique: :until_executed

  def perform(preview_card_id)
    return if preview_card_id.nil?
    DeletePreviewCardService.new.call(PreviewCard.find(preview_card_id))
  end
end
