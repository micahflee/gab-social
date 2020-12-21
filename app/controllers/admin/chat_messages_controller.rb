# frozen_string_literal: true

module Admin
  class ChatMessagesController < BaseController
    before_action :set_account

    PER_PAGE = 100

    def index
      authorize :chat_message, :index?

      @chat_messages = ChatMessage.where(from_account: @account).page(params[:page]).per(PER_PAGE)
      @form = Form::ChatMessageBatch.new
    end

    def show
      authorize :chat_message, :index?

      @chat_messages = @account.chat_messages.where(id: params[:id])
      authorize @chat_messages.first, :show?

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

    def form_chat_message_batch_params
      params.require(:form_chat_message_batch).permit(:action, chat_message_ids: [])
    end

    def set_account
      @account = Account.find(params[:account_id])
    end

    def current_params
      page = (params[:page] || 1).to_i

      {
        media: params[:media],
        page: page > 1 && page,
      }.select { |_, value| value.present? }
    end

    def action_from_button
      if params[:delete]
        'delete'
      end
    end
  end
end
