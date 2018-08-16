class CreatePeople < ActiveRecord::Migration[5.2]
  def change
    create_table :people do |t|
      t.string :name
      t.string :email
      t.integer :pidm
      t.integer :sid
      t.integer :emp_id
      t.integer :iam_id
      t.string :cas_user
      t.integer :dems_id
      t.integer :cims_id

      t.timestamps
    end
  end
end
