class CreateConsultationCategories < ActiveRecord::Migration[5.2]
  def change
    create_table :consultation_categories do |t|
      t.string :name
      t.string :description

      t.timestamps
    end
  end
end
