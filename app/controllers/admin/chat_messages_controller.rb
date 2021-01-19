# frozen_string_literal: true

module Admin
  class ChatMessagesController < BaseController
    PER_PAGE = 50

    def index
      authorize :chat_message, :index?

      @chat_messages = filtered_chat_messages.page(params[:page]).per(PER_PAGE)
      @form = Form::ChatMessageBatch.new
    end

    def show
      authorize :chat_message, :index?

      @chat_message = ChatMessage.where(id: params[:id])
      authorize @chat_message, :show?

      @form = Form::ChatMessageBatch.new
    end

    def create
      authorize :chat_message, :update?

      @form         = Form::ChatMessageBatch.new(form_chat_message_batch_params.merge(current_account: current_account, action: action_from_button))
      flash[:alert] = I18n.t('admin.statuses.failed_to_execute') unless @form.save

      redirect_to admin_account_chat_messages_path(@account.id, current_params)
    rescue ActionController::ParameterMissing
      flash[:alert] = I18n.t('admin.statuses.no_status_selected')

      redirect_to admin_account_chat_messages_path(@account.id, current_params)
    end

    private

    def filtered_chat_messages
      ChatMessageFilter.new(filter_params).results
    end
    
    def form_chat_message_batch_params
      params.require(:form_chat_message_batch).permit(:action, chat_message_ids: [])
    end

    def current_params
      page = (params[:page] || 1).to_i

      {
        page: page > 1 && page,
      }.select { |_, value| value.present? }
    end

    def action_from_button
      if params[:delete]
        'delete'
      end
    end

    def filter_params
      params.permit(
        :id,
        :text,
        :account_id,
        :created_at_lte,
        :created_at_gte
      )
    end
  end
end
