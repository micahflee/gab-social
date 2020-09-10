class ValidateAddForeignKeyToGroupForGroupCategory < ActiveRecord::Migration[5.2]
  def change
    validate_foreign_key :groups, :group_categories
  end
end
