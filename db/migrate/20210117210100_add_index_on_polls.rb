class AddIndexOnPolls < ActiveRecord::Migration[5.2]
  disable_ddl_transaction!

  def change
    add_index :polls, [:id, :lock_version], algorithm: :concurrently
  end
end
