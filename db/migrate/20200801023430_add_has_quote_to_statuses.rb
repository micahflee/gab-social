class AddHasQuoteToStatuses < ActiveRecord::Migration[5.2]
  def change
    add_column :statuses, :has_quote, :boolean
  end
end
