class AddUnreadCountToChatConversationAccountsNotNull < ActiveRecord::Migration[5.2]
  def change
    change_column_null :chat_conversation_accounts, :unread_count, false
  end
end
