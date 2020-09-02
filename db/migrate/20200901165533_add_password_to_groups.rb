class AddPasswordToGroups < ActiveRecord::Migration[5.2]
  def change
    add_column :groups, :password, :string
  end
end
