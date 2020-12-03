class AddChatMessageExpirationPolicyToChatConversationAccounts < ActiveRecord::Migration[5.2]
  def change
    add_column :chat_conversation_accounts, :chat_message_expiration_policy, :string, null: true, default: nil
  end
end
