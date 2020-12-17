class AddMissingForeignKeys < ActiveRecord::Migration[5.2]
  disable_ddl_transaction!

  def change
    safety_assured { add_foreign_key :chat_blocks, :accounts, column: :target_account_id, on_delete: :cascade }
    safety_assured { add_foreign_key :chat_blocks, :accounts, column: :account_id, on_delete: :cascade }

    safety_assured { add_foreign_key :chat_conversation_accounts, :chat_messages, column: :last_chat_message_id, on_delete: :nullify }

    safety_assured { add_foreign_key :chat_messages, :accounts, column: :from_account_id, on_delete: :cascade }
    safety_assured { add_foreign_key :chat_messages, :chat_conversations, column: :chat_conversation_id, on_delete: :cascade }

    safety_assured { add_foreign_key :status_bookmark_collections, :accounts, column: :account_id, on_delete: :cascade }
    
    safety_assured { add_foreign_key :media_attachment_albums, :accounts, column: :account_id, on_delete: :cascade }
    safety_assured { add_foreign_key :media_attachment_albums, :media_attachments, column: :cover_id, on_delete: :nullify }
  end
end