# frozen_string_literal: true

class DropConversationMutes < ActiveRecord::Migration[5.2]
  def up
    drop_table :conversation_mutes
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end