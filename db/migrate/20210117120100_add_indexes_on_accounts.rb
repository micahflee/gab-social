class AddIndexesOnAccounts < ActiveRecord::Migration[5.2]
  disable_ddl_transaction!

  def change
    add_index :accounts, :locked, algorithm: :concurrently
    add_index :accounts, :domain, algorithm: :concurrently
  end
end
