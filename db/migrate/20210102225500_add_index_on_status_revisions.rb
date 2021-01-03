class AddIndexOnStatusRevisions < ActiveRecord::Migration[5.2]
  disable_ddl_transaction!

  def change
    add_index :status_revisions, :status_id, algorithm: :concurrently
  end
end
