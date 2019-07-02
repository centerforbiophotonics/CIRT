class CreateConsultations < ActiveRecord::Migration[5.2]
  def change
    create_table :consultations do |t|
      t.string :description
      t.string :dates
      t.string :consultants
      t.string :minutes
      t.references :consultation_category, foreign_key: true
      t.integer :ccrc_id

      t.timestamps
    end
  end
end
