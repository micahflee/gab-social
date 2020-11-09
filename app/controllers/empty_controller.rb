# frozen_string_literal: true

class EmptyController < ActionController::Base

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

end
