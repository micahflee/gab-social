class CreateStatusBookmarkCollections < ActiveRecord::Migration[5.2]
  def change
    create_table :status_bookmark_collections do |t|
      t.text :title, null: false, default: ''
      t.integer :account_id, null: false

      t.timestamps null: false
    end
  end
end
