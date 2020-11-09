# frozen_string_literal: true

class Api::V1::PopularLinksController < Api::BaseController

  def show
    type = params[:type]

    if type == 'links'
      render json: get_cards, each_serializer: REST::PreviewCardSerializer
    elsif type == 'videos'
      render json: get_videos, each_serializer: REST::PreviewCardSerializer
    elsif type == 'gab'
      render json: get_top_gab, each_serializer: REST::StatusSerializer
    else
      raise GabSocial::NotPermittedError
    end
  end

  private

  def get_top_gab
    # prod gab.com @gab account = 251
    Status.where(account_id: '251').limit(2)
  end

  def get_videos
    return []
  end

  def get_cards
    body = Redis.current.get("popular_links:card_ids")
  
    if body.nil? || body.empty?
      statusIds = Status.where('statuses.created_at > ?', 24.hours.ago)
                    .joins(:status_stat)
                    .order('status_stats.favourites_count DESC')
                    .where('status_stats.favourites_count > 15')
                    .joins("LEFT JOIN preview_cards_statuses ON statuses.id = preview_cards_statuses.status_id")
                    .where('preview_cards_statuses.status_id IS NOT NULL')
                    .limit(100)
                    .pluck('statuses.id')

      cards = PreviewCard.joins("LEFT JOIN preview_cards_statuses ON preview_cards.id = preview_cards_statuses.preview_card_id")
                    .where('preview_cards_statuses.preview_card_id IS NOT NULL')
                    .where('preview_cards_statuses.status_id IN (?)', statusIds)
                    .having('COUNT(preview_cards_statuses.preview_card_id) > 1')
                    .where('preview_cards.updated_at > ?', 24.hours.ago)
                    .order('COUNT(preview_cards_statuses.preview_card_id) DESC')
                    .group('preview_cards.id')
                    .limit(10)
      
      card_ids = cards.map(&:id)
      
      Redis.current.set("popular_links:card_ids", card_ids.join(',')) 
      Redis.current.expire("popular_links:card_ids", 15.minutes.seconds)
    
      return cards
    else
      cards = PreviewCard.where(id: body.split(','))
      return cards
    end

  end

end
