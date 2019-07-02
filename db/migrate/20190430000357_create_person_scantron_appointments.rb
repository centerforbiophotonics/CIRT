class CreatePersonScantronAppointments < ActiveRecord::Migration[5.2]
  def change
    create_table :person_scantron_appointments do |t|
      t.belongs_to :person, foreign_key: true
      t.belongs_to :scantron_appointment, foreign_key: true

      t.timestamps
    end
  end
end
