# frozen_string_literal: true

class Form::PreviewCardBatch
  include ActiveModel::Model
  include AccountableConcern

  attr_accessor :preview_card_ids, :action, :current_account

  def save
    case action
    when 'delete'
      delete_preview_cards
    end
  end

  private

  def delete_preview_cards
    PreviewCard.where(id: preview_card_ids).reorder(nil).find_each do |preview_card|
      DeletePreviewCardWorker.perform_async(preview_card.id)
      log_action :destroy, preview_card
    end

    true
  end
end
