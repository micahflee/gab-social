# frozen_string_literal: true

class DropAccountDomainBlocks < ActiveRecord::Migration[5.2]
  def up
    drop_table :account_domain_blocks
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end