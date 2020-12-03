class AddExpiresAtToChatMessages < ActiveRecord::Migration[5.2]
  def change
    add_column :chat_messages, :expires_at, :datetime, null: true, default: nil
  end
end
