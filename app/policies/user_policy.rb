class UserPolicy < ApplicationPolicy
  def initialize(current_user, user)
    @user = current_user
    @user_record = user
  end

  def index?
    @user.has_role?("manage_users") && !@user.has_role?("no_access")
  end

  def show?
    @user.has_role?("manage_users") && !@user.has_role?("no_access")
  end

  def create?
    @user.has_role?("manage_users") && !@user.has_role?("no_access")
  end

  def new?
    create?
  end

  def update?
    @user.has_role?("manage_users") && !@user.has_role?("no_access")
  end

  def edit?
    update?
  end

  def destroy?
    @user.has_role?("manage_users") && !@user.has_role?("no_access")
  end

  class Scope < Scope
    def resolve
      scope
    end
  end
end
