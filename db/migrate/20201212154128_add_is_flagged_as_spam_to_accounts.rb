class AddIsFlaggedAsSpamToAccounts < ActiveRecord::Migration[5.2]
  def up
    safety_assured { add_column :accounts, :is_flagged_as_spam, :bool, default: false, null: false }
  end

  def down
    remove_column :accounts, :is_pro
  end
end
