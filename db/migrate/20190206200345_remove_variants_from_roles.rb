class RemoveVariantsFromRoles < ActiveRecord::Migration[5.2]
  def change
    remove_column :roles, :variants
  end
end
