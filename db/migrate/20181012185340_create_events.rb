class CreateEvents < ActiveRecord::Migration[5.2]
  def change
    create_table :events do |t|
      t.string :name
      t.string :description
      t.date :date
      t.references :event_category, foreign_key: true

      t.timestamps
    end
  end
end
