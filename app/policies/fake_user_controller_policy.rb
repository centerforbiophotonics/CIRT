class FakeUserControllerPolicy < ApplicationPolicy
  attr_reader :user, :ctrlr

  def initialize(user, ctrlr)
    @user = user
    @ctrlr = ctrlr
  end

  def set_user?
    Rails.env.development?
  end

  class Scope < Scope
    def resolve
      scope
    end
  end
end
