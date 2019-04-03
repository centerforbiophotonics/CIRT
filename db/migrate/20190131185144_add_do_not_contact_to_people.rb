class AddDoNotContactToPeople < ActiveRecord::Migration[5.2]
  def change
    add_column :people, :do_not_contact, :boolean, :default => false
  end
end
