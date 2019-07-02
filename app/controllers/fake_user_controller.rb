class FakeUserController < ApplicationController
  def set_user
    authorize self
    
    if params[:cas_user] != "logged_out" && User.where(:cas_user => params[:cas_user]).count == 0
      User.new(:cas_user => params[:cas_user], :name => params[:cas_user], :email => params[:cas_user]).save
    end

    Rails.cache.write("fake_cas_user", params[:cas_user])

    redirect_back fallback_location: root_path
  end
end
