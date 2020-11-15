# frozen_string_literal: true

class DropFeaturedTags < ActiveRecord::Migration[5.2]
  def up
    drop_table :featured_tags
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end