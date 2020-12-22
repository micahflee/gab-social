class CreateAccountUsernameChanges < ActiveRecord::Migration[5.2]
  def change
    create_table :account_username_changes do |t|
      t.belongs_to :account, foreign_key: { on_delete: :cascade }, null: false
      t.text :from_username, null: false, default: ''
      t.text :to_username, null: false, default: ''
      t.timestamps
    end
  end
end
