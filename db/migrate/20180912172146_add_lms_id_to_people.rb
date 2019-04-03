class AddLmsIdToPeople < ActiveRecord::Migration[5.2]
  def change
    add_column :people, :lms_id, :integer
  end
end
