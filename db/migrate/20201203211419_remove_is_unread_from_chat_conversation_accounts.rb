class RemoveIsUnreadFromChatConversationAccounts < ActiveRecord::Migration[5.2]
  def change
    safety_assured { remove_column :chat_conversation_accounts, :is_unread }
  end
end
