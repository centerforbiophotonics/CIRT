class PersonGroupPolicy < ApplicationPolicy
  def all_roles?
    @user.has_role?("view") && !@user.has_role?("no_access")
  end
end
