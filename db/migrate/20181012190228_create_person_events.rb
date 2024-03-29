class CreatePersonEvents < ActiveRecord::Migration[5.2]
  def change
    create_table :person_events do |t|
      t.belongs_to :person, foreign_key: true
      t.belongs_to :event, foreign_key: true
      t.string :status

      t.timestamps
    end
  end
end
