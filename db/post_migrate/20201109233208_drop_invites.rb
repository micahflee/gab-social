# frozen_string_literal: true

class DropInvites < ActiveRecord::Migration[5.2]
  def up
    drop_table :invites
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end