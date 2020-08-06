class CreateGroupPinnedStatuses < ActiveRecord::Migration[5.2]
  disable_ddl_transaction!

  def change
    create_table :group_pinned_statuses do |t|
      t.belongs_to :status, foreign_key: { on_delete: :cascade }, null: false
      t.belongs_to :group, foreign_key: { on_delete: :cascade }, null: false
    end

    add_index :group_pinned_statuses, [:status_id, :group_id], unique: true, algorithm: :concurrently
  end
end
