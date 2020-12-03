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

  def current_user
    nil
  end

  def current_account
    nil
  end

  def current_session
    nil
  end

  protected

  def limit_param(default_limit)
    return default_limit unless params[:limit]
    [params[:limit].to_i.abs, default_limit * 2].min
  end

  def truthy_param?(key)
    ActiveModel::Type::Boolean.new.cast(params[key])
  end
  

end
