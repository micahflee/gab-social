class RemoveChatMutes < ActiveRecord::Migration[5.2]
  def change
    drop_table :chat_mutes
  end
end
