class CreateMediaAttachmentAlbums < ActiveRecord::Migration[5.2]
  def change
    create_table :media_attachment_albums do |t|
      t.text :title, null: false, default: ''
      t.text :description
      t.integer :account_id, null: false
      t.integer :visibility, null: false, default: 0

      t.timestamps null: false
    end
  end
end