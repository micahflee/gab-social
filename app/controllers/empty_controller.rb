# frozen_string_literal: true

class EmptyController < ActionController::Base

  include RateLimitHeaders

  protect_from_forgery with: :null_session

  rescue_from ActiveRecord::RecordInvalid, GabSocial::ValidationError do |e|
    render json: { error: e.to_s }, status: 422
  end

  rescue_from ActiveRecord::RecordNotFound do
    render json: { error: 'Record not found' }, status: 404
  end

  rescue_from HTTP::Error, GabSocial::UnexpectedResponseError do
    render json: { error: 'Remote data could not be fetched' }, status: 503
  end

  rescue_from OpenSSL::SSL::SSLError do
    render json: { error: 'Remote SSL certificate could not be verified' }, status: 503
  end

  rescue_from GabSocial::NotPermittedError do
    render json: { error: 'This action is not allowed' }, status: 403
  end

  def doorkeeper_unauthorized_render_options(error: nil)
    { json: { error: (error.try(:description) || 'Not authorized') } }
  end

  def doorkeeper_forbidden_render_options(*)
    { json: { error: 'This action is outside the authorized scopes' } }
  end

  protected

  def set_pagination_headers(next_path = nil, prev_path = nil)
    links = []
    links << [next_path, [%w(rel next)]] if next_path
    links << [prev_path, [%w(rel prev)]] if prev_path
    response.headers['Link'] = LinkHeader.new(links) unless links.empty?
  end

  def current_user
    nil
  end

  def current_account
    nil
  end

  def current_session
    nil
  end

  def gone
    respond_with_error(410)
  end

  def cache_collection(raw, klass)
    return raw unless klass.respond_to?(:with_includes)

    raw                    = raw.cache_ids.to_a if raw.is_a?(ActiveRecord::Relation)
    cached_keys_with_value = Rails.cache.read_multi(*raw).transform_keys(&:id)
    uncached_ids           = raw.map(&:id) - cached_keys_with_value.keys

    klass.reload_stale_associations!(cached_keys_with_value.values) if klass.respond_to?(:reload_stale_associations!)

    unless uncached_ids.empty?
      uncached = klass.where(id: uncached_ids).with_includes.each_with_object({}) { |item, h| h[item.id] = item }

      uncached.each_value do |item|
        Rails.cache.write(item, item)
      end
    end

    raw.map { |item| cached_keys_with_value[item.id] || uncached[item.id] }.compact
  end

  def limit_param(default_limit)
    return default_limit unless params[:limit]
    [params[:limit].to_i.abs, default_limit * 2].min
  end

  def truthy_param?(key)
    ActiveModel::Type::Boolean.new.cast(params[key])
  end


end
