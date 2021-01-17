class AddIndexOnUsersRememberToken < ActiveRecord::Migration[5.2]
  disable_ddl_transaction!

  def change
    add_index :users, :remember_token, algorithm: :concurrently
  end
end
