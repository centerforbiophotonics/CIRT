class AddUniquenessIndicesToPerson < ActiveRecord::Migration[5.2]
  def change
    add_index :people, :email, :unique => true, :where => "email != ''"
    add_index :people, :pidm, :unique => true, :where => "email != ''"
    add_index :people, :sid, :unique => true, :where => "email != ''"
    add_index :people, :emp_id, :unique => true, :where => "email != ''"
    add_index :people, :iam_id , :unique => true, :where => "email != ''"
    add_index :people, :cas_user, :unique => true, :where => "email != ''"
    add_index :people, :dems_id, :unique => true, :where => "email != ''"
    add_index :people, :cims_id, :unique => true, :where => "email != ''"
  end
end
