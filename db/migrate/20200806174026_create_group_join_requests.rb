class CreateGroupJoinRequests < ActiveRecord::Migration[5.2]
  disable_ddl_transaction!

  def change
    create_table :group_join_requests do |t|
      t.belongs_to :account, foreign_key: { on_delete: :cascade }, null: false
      t.belongs_to :group, foreign_key: { on_delete: :cascade }, null: false

      t.timestamps null: false
    end

    add_index :group_join_requests, [:account_id, :group_id], unique: true, algorithm: :concurrently
  end
end
