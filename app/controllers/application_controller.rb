class ApplicationController < ActionController::Base
  include Pundit
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  before_action RubyCAS::Filter, :if => -> {Rails.env.production?}
  before_action :dev_cas_user, :if => -> {Rails.env.development? || Rails.env.test?}

  helper_method :current_user

  def dev_cas_user
    cas_user = Rails.cache.read("fake_cas_user")

    if cas_user.nil?
      cas_user = "dev_edit"
      Rails.cache.write("fake_cas_user", "dev_admin")
    end

    session[:cas_user] = cas_user
  end

  def current_user
    unless @current_user.present?
      @current_user = User.find_by(:cas_user => session[:cas_user])

      unless @current_user.present?
        @current_user =  User.create!(:cas_user => session[:cas_user])
      end

      cookies['user_id'] = {
        :value => @current_user.cas_user
      }
    end
    @current_user
  end

  private

  def user_not_authorized
    flash[:alert] = "You are not authorized to perform this action."
    render("layouts/not_authorized")
  end
end
