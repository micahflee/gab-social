class AddStatusBookmarkCollectionIdToStatusBookmarks < ActiveRecord::Migration[5.2]
  def change
    safety_assured { 
      add_reference :status_bookmarks, :status_bookmark_collection, foreign_key: { on_delete: :nullify }
    }
  end
end
