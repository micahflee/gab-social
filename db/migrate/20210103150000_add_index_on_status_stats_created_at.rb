class AddIndexOnStatusStatsCreatedAt < ActiveRecord::Migration[5.2]
  disable_ddl_transaction!

  def change
    add_index :status_stats, :created_at, algorithm: :concurrently
  end
end
