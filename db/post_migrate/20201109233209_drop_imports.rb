# frozen_string_literal: true

class DropImports < ActiveRecord::Migration[5.2]
  def up
    drop_table :imports
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end