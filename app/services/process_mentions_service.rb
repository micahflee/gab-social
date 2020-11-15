# frozen_string_literal: true

class ProcessMentionsService < BaseService
  # Scan status for mentions and fetch remote mentioned users, create
  # local mention pointers, send Salmon notifications to mentioned
  # remote users
  # @param [Status] status
  def call(status)
    return unless status.local?

    @status  = status
    mentions = []

    status.text = status.text.gsub(Account::MENTION_RE) do |match|
      username, domain  = Regexp.last_match(1).split('@')
      mentioned_account = Account.find_local(username)

      next match if mentioned_account.nil? || mentioned_account&.suspended?

      mentions << mentioned_account.mentions.where(status: status).first_or_create(status: status)

      "@#{mentioned_account.acct}"
    end

    status.save!

    mentions.each { |mention| create_notification(mention) }
  end

  private

  def create_notification(mention)
    mentioned_account = mention.account

    if mentioned_account.local?
      LocalNotificationWorker.perform_async(mentioned_account.id, mention.id, mention.class.name)
    end
  end

end
