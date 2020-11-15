# frozen_string_literal: true

class DropDomainBlocks < ActiveRecord::Migration[5.2]
  def up
    drop_table :domain_blocks
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end