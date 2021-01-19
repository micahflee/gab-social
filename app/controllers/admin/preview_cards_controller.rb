# frozen_string_literal: true

module Admin
  class PreviewCardsController < BaseController
    before_action :set_preview_card, except: [:index]

    def index
      authorize :preview_card, :index?
      
      @preview_cards = filtered_preview_cards.page(params[:page])
      @form = Form::PreviewCardBatch.new
    end

    def show
      authorize @preview_card, :show?
      @form = Form::PreviewCardBatch.new
    end

    def create
      authorize :preview_card, :update?

      @form         = Form::PreviewCardBatch.new(form_preview_card_batch_params.merge(current_account: current_account, action: action_from_button))
      flash[:alert] = I18n.t('admin.statuses.failed_to_execute') unless @form.save

      redirect_to admin_preview_cards_path(@account.id, current_params)
    rescue ActionController::ParameterMissing
      flash[:alert] = I18n.t('admin.statuses.no_status_selected')

      redirect_to admin_preview_cards_path(@account.id, current_params)
    end

    private

    def form_preview_card_batch_params
      params.require(:form_preview_card_batch).permit(:action, preview_card_ids: [])
    end

    def filtered_preview_cards
      PreviewCardFilter.new(filter_params).results.order(id: :desc)
    end

    def filter_params
      params.permit(
        :title,
        :description,
        :url,
      )
    end

    def set_preview_card
      @preview_card = PreviewCard.find(params[:id])
    end

    def action_from_button
      if params[:delete]
        'delete'
      end
    end

  end
end
