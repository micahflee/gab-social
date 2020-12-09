class CreateLinkBlocks < ActiveRecord::Migration[5.2]
  def change
    create_table :link_blocks do |t|
      t.string :link, null: false, default: ''
      t.timestamps null: false
    end
    
    add_index :link_blocks, :link, unique: true
  end
end