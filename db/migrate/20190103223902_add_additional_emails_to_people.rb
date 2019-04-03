class AddAdditionalEmailsToPeople < ActiveRecord::Migration[5.2]
  def change
    add_column :people, :additional_emails, :string
  end
end
