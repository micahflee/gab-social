class AddIndexToStatusCreatedAt < ActiveRecord::Migration[5.2]
  disable_ddl_transaction!

  def change
    add_index :statuses, :created_at, algorithm: :concurrently
    add_index :statuses, :updated_at, algorithm: :concurrently
  end
end
