class AddIndexesToStatusStats < ActiveRecord::Migration[5.2]
  disable_ddl_transaction!

  def change
    add_index :status_stats, :updated_at, algorithm: :concurrently
    add_index :status_stats, :replies_count, algorithm: :concurrently
    add_index :status_stats, :reblogs_count, algorithm: :concurrently
    add_index :status_stats, :favourites_count, algorithm: :concurrently
  end
end
