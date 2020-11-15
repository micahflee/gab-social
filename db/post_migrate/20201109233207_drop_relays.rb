# frozen_string_literal: true

class DropRelays < ActiveRecord::Migration[5.2]
  def up
    drop_table :relays
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end