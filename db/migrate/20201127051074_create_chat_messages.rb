class CreateChatMessages < ActiveRecord::Migration[5.2]
  def change
    create_table :chat_messages do |t|
      t.text :text, null: false, default: ''
      t.text :language, null: false, default: ''
      t.integer :from_account_id, null: false
      t.integer :chat_conversation_id, null: false

      t.timestamps null: false
    end

    add_index :chat_messages, [:from_account_id, :chat_conversation_id]
  end
end
