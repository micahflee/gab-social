class CreateGroupCategories < ActiveRecord::Migration[5.2]
  def change
    create_table :group_categories do |t|
      t.timestamps
      t.string :text, null: false, default: ''
    end
  end
end
