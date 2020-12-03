class RemoveDisabledFromCustomEmojis < ActiveRecord::Migration[5.2]
  def change
    safety_assured { remove_column :custom_emojis, :disabled }
  end
end