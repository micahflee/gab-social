class AddForeignKeyToGroupForGroupCategory < ActiveRecord::Migration[5.2]
  def change
    add_column :groups, :group_category_id, :integer
    add_foreign_key :groups, :group_categories, on_delete: :nullify, validate: false
  end
end
