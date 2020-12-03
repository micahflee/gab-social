class AddUnreadCountToChatConversationAccounts < ActiveRecord::Migration[5.2]
  def up
    add_column :chat_conversation_accounts, :unread_count, :bigint
    change_column_default :chat_conversation_accounts, :unread_count, 0
  end

  def down
    remove_column :chat_conversation_accounts, :unread_count
  end
end
