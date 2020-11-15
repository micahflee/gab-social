# frozen_string_literal: true

class DropUserInviteRequests < ActiveRecord::Migration[5.2]
  def up
    drop_table :user_invite_requests
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end