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

    @chat_conversation = ChatConversation.create

    my_chat = ChatConversationAccount.create!(
                account: @current_account,
                participant_account_ids: account_ids_as_array,
                chat_conversation: @chat_conversation,
                is_approved: true
              )

    if @other_accounts.length == 1 && @other_accounts[0].id == @current_account.id
      # dont create two conversations if you are chatting with yourself
    else
      for other_account in @other_accounts
        this_conversation_participants = @other_accounts.map { |account|
          account.id.to_s
        }.reject { |id| id == other_account.id.to_s } << @current_account.id.to_s

        # is_approved = other_account&.user&.setting_chat_messages_restrict_non_followers == true

        ChatConversationAccount.create!(
          account: other_account,
          participant_account_ids: this_conversation_participants,
          chat_conversation: @chat_conversation,
          is_approved: false
        )
      end
    end
    
    my_chat
  end

  def account_ids_as_array
    @other_accounts.map { |account| account.id.to_s }
  end

end
