class AddIndexToStatusesReply < ActiveRecord::Migration[5.2]
  disable_ddl_transaction!

  def change
    if !index_exists?(:statuses, :reply)
      add_index :statuses, :reply, algorithm: :concurrently
    end
  end
end
