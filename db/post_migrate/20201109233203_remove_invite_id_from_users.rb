class RemoveInviteIdFromUsers < ActiveRecord::Migration[5.2]
  def change
    safety_assured { remove_column :users, :invite_id }
  end
end