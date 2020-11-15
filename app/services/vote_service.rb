# frozen_string_literal: true

class VoteService < BaseService
  include Authorization

  def call(account, poll, choices)
    authorize_with account, poll, :vote?

    @account = account
    @poll    = poll
    @choices = choices
    @votes   = []

    ApplicationRecord.transaction do
      @choices.each do |choice|
        @votes << @poll.votes.create!(account: @account, choice: choice)
      end
    end

    ActivityTracker.increment('activity:interactions')
  end

end
