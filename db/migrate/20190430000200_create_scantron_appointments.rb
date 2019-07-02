class CreateScantronAppointments < ActiveRecord::Migration[5.2]
  def change
    create_table :scantron_appointments do |t|
      t.date :date
      t.string :course
      t.string :term_code
      t.integer :number_of_scantrons

      t.timestamps
    end
  end
end
