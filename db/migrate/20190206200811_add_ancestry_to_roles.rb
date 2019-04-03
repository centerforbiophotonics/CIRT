class AddAncestryToRoles < ActiveRecord::Migration[5.2]
  def change
    add_column :roles, :ancestry, :string
    add_index :roles, :ancestry
  end
end
