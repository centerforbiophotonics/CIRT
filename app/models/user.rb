class User < ApplicationRecord
   serialize :roles, Array

   def self.role_list
    %w(
      edit
      view
      manage_users
      no_access
    )
  end

  def has_role? role
    User.role_list.include?(role) && roles.include?(role)
  end
end
