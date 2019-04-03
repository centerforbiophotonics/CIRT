class CreateFunds < ActiveRecord::Migration[5.2]
  def change
    create_table :funds do |t|
      t.integer :amount
      t.string :name
      t.string :description
      t.date :date
      t.boolean :external
      t.string :source

      t.timestamps
    end
  end
end
