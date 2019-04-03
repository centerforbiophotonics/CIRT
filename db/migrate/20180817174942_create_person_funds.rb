class CreatePersonFunds < ActiveRecord::Migration[5.2]
  def change
    create_table :person_funds do |t|
      t.belongs_to :person, foreign_key: true
      t.belongs_to :fund, foreign_key: true

      t.timestamps
    end
  end
end
