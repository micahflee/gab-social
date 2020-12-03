class CreateChatBlocks < ActiveRecord::Migration[5.2]
  def change
    create_table :chat_blocks do |t|
      t.integer :account_id, null: false
      t.integer :target_account_id, null: false

      t.timestamps null: false
    end

    add_index :chat_blocks, [:account_id, :target_account_id], unique: true
  end
end


