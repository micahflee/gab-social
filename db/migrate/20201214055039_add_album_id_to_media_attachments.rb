class AddAlbumIdToMediaAttachments < ActiveRecord::Migration[5.2]
  def change
    safety_assured { 
      add_reference :media_attachments, :media_attachment_album, foreign_key: { on_delete: :nullify }
    }
  end
end
