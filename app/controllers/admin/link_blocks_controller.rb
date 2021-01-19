# frozen_string_literal: true

module Admin
  class LinkBlocksController < BaseController
    before_action :set_link_block, only: [:show, :destroy]

    def index
      authorize :link_block, :index?
      @link_blocks = filtered_link_blocks.alphabetical.page(params[:page])
    end

    def new
      authorize :link_block, :create?
      @link_block = LinkBlock.new
    end

    def create
      authorize :link_block, :create?

      @link_block = LinkBlock.new(resource_params)

      if @link_block.save
        log_action :create, @link_block
        redirect_to admin_link_blocks_path, notice: I18n.t('admin.link_blocks.created_msg')
      else
        render :new
      end
    end

    def destroy
      authorize @link_block, :destroy?
      @link_block.destroy!
      log_action :destroy, @link_block
      redirect_to admin_link_blocks_path, notice: I18n.t('admin.link_blocks.destroyed_msg')
    end

    private

    def filtered_link_blocks
      LinkBlockFilter.new(filter_params).results
    end

    def set_link_block
      @link_block = LinkBlock.find(params[:id])
    end

    def filter_params
      params.permit(:link)
    end

    def resource_params
      params.require(:link_block).permit(:link)
    end
  end
end
