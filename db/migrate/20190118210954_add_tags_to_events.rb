class AddTagsToEvents < ActiveRecord::Migration[5.2]
  def change
    add_column :events, :tags, :string
  end
end
