class ApplicationPolicy
  attr_reader :user, :record

  def initialize(user, record)
    @user = user
    @record = record
  end

  def index?
    @user.has_role?("view") && !@user.has_role?("no_access")
  end

  def create?
    @user.has_role?("edit") && !@user.has_role?("no_access")
  end

  def update?
    @user.has_role?("edit") && !@user.has_role?("no_access")
  end

  def destroy?
    @user.has_role?("edit") && !@user.has_role?("no_access")
  end

  def search?
    @user.has_role?("view") && !@user.has_role?("no_access")
  end

  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      scope.all
    end
  end
end

class ConsultationPolicy < ApplicationPolicy
end

class ConsultationCategoryPolicy < ApplicationPolicy
end

class EventCategoryPolicy < ApplicationPolicy
end

class EventPolicy < ApplicationPolicy
end

class FundPolicy < ApplicationPolicy
end

class GroupCategoryPolicy < ApplicationPolicy
end

class GroupPolicy < ApplicationPolicy
end

class PersonConsultationPolicy < ApplicationPolicy
end

class PersonEventPolicy < ApplicationPolicy
end

class PersonFundPolicy < ApplicationPolicy
end


class PersonScantronAppointmentPolicy < ApplicationPolicy
end

class RolePolicy < ApplicationPolicy
end

class ScantronAppointmentPolicy < ApplicationPolicy
end
