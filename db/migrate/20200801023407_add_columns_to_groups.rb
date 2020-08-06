class AddColumnsToGroups < ActiveRecord::Migration[5.2]
  disable_ddl_transaction!

  def change
    add_column :groups, :slug, :text
    add_column :groups, :is_private, :boolean
    add_column :groups, :is_visible, :boolean
    add_column :groups, :tags, :string, array: true
    
    add_reference :groups, :group_categories, index: false
    add_index :groups, :group_categories_id, algorithm: :concurrently

    change_column_default :groups, :is_private, false
    change_column_default :groups, :is_visible, true
    change_column_default :groups, :tags, []

    add_index :groups, :slug, unique: true, algorithm: :concurrently
  end
end