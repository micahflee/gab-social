class AddIndexToUserCurrentSignInAt < ActiveRecord::Migration[5.2]
  disable_ddl_transaction!

  def change
    add_index :users, :current_sign_in_at, algorithm: :concurrently
  end
end
