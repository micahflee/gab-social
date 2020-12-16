class AddCoverIdToMediaAttachmentAlbums < ActiveRecord::Migration[5.2]
  disable_ddl_transaction!

  def change
    add_reference :media_attachment_albums, :cover, null: true, default: nil, index: { algorithm: :concurrently }
  end
end
