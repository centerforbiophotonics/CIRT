class PersonPolicy < ApplicationPolicy
  def iam_lookup?
    @user.has_role?("edit") && !@user.has_role?("no_access")
  end

  def merge_assoc?
    @user.has_role?("edit") && !@user.has_role?("no_access")
  end

  def event_filter?
    @user.has_role?("view") && !@user.has_role?("no_access")
  end

  def group_filter?
    @user.has_role?("view") && !@user.has_role?("no_access")
  end
end
