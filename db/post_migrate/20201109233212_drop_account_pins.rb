# frozen_string_literal: true

class DropAccountPins < ActiveRecord::Migration[5.2]
  def up
    drop_table :account_pins
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end