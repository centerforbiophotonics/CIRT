class ApplicationController < ActionController::Base

  before_action RubyCAS::Filter, :if => -> { Rails.env.production? }
  before_action :dev_cas_user, :if => -> { Rails.env.development? }
  helper_method :current_user

  def dev_cas_user
    session[:cas_user] = "dev_user"
  end

  def current_user
    User.find_by(:cas_user => session[:cas_user])
  end
end
