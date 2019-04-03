class CreateGroups < ActiveRecord::Migration[5.2]
  def change
    create_table :groups do |t|
      t.string :name
      t.string :description
      t.belongs_to :group_category, foreign_key: true

      t.timestamps
    end

    add_index :groups, :name, :unique => true
  end
end
