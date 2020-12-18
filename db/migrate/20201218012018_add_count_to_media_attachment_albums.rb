class AddCountToMediaAttachmentAlbums < ActiveRecord::Migration[5.2]
  disable_ddl_transaction!

  def change
    safety_assured { add_column :media_attachment_albums, :count, :integer, null: false, default: 0 }
  end
end
