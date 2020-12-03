class CreateChatMutes < ActiveRecord::Migration[5.2]
  def change
    create_table :chat_mutes do |t|
      t.integer :account_id, null: false
      t.integer :target_account_id, null: false

      t.timestamps null: false
    end

    add_index :chat_mutes, [:account_id, :target_account_id], unique: true
  end
end
