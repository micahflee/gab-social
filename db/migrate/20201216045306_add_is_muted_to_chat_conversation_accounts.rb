class AddIsMutedToChatConversationAccounts < ActiveRecord::Migration[5.2]
  def up
    safety_assured { add_column :chat_conversation_accounts, :is_muted, :bool, default: false, null: false }
  end

  def down
    remove_column :chat_conversation_accounts, :is_muted
  end
end
