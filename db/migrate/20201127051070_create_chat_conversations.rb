class CreateChatConversations < ActiveRecord::Migration[5.2]
  def change
    create_table :chat_conversations do |t|
      t.timestamps null: false
    end
  end
end


