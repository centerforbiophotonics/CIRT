class CreatePersonGroups < ActiveRecord::Migration[5.2]
  def change
    create_table :person_groups do |t|
      t.belongs_to :group, foreign_key: true
      t.belongs_to :person, foreign_key: true
      t.string :role
      t.date :start
      t.date :end

      t.timestamps
    end
  end
end
