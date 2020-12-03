class CreateChatConversationAccounts < ActiveRecord::Migration[5.2]
  def change
    create_table :chat_conversation_accounts do |t|
      t.belongs_to :account, foreign_key: { on_delete: :cascade }
      t.belongs_to :chat_conversation, foreign_key: { on_delete: :cascade }
      t.bigint :participant_account_ids, array: true, null: false, default: []
      t.bigint :last_chat_message_id, null: true, default: nil
      t.boolean :is_unread, null: false, default: false
      t.boolean :is_hidden, null: false, default: false
      t.boolean :is_approved, null: false, default: false
      t.timestamps null: false
    end
  end
end


