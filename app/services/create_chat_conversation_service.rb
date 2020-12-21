# frozen_string_literal: true

class CreateChatConversationService < BaseService

  def call(current_account, other_accounts)
    @current_account = current_account
    @other_accounts = other_accounts

    return nil if @other_accounts.nil? || @current_account.nil?

    # check if already created
    chat = ChatConversationAccount.find_by(account: current_account, participant_account_ids: account_ids_as_array)

    return chat unless chat.nil?

    # : todo :
    # check if allow anyone to message then create with approved:true
    # unique account id, participants

    chat_conversation = ChatConversation.create

    my_chat = ChatConversationAccount.create!(
                account: current_account,
                participant_account_ids: [@account.id.to_s],
                chat_conversation: chat_conversation,
                is_approved: true
              )

    # : todo : if multiple ids
    if @account.id != current_account.id
      their_chat = ChatConversationAccount.create!(
                    account: @account,
                    participant_account_ids: [current_account.id.to_s],
                    chat_conversation: chat_conversation,
                    is_approved: false # : todo : check if allow all else default as request
                  )
    end
  end

  def account_ids_as_array
    @other_accounts.map { |account| account.id.to_s }
  end

end
