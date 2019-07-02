class CreatePersonConsultations < ActiveRecord::Migration[5.2]
  def change
    create_table :person_consultations do |t|
      t.belongs_to :person, foreign_key: true
      t.belongs_to :consultation, foreign_key: true

      t.timestamps
    end
  end
end
