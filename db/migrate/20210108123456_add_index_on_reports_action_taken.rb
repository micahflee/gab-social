class AddIndexOnReportsActionTaken < ActiveRecord::Migration[5.2]
  disable_ddl_transaction!

  def change
    add_index :reports, :action_taken, algorithm: :concurrently
  end
end
