class PeopleController < ApplicationController
  before_action :set_person, only: [:update, :destroy]

  # GET /people
  def index
    @people = Person.all.map{|m| [m.id, m.with_associations] }.to_h
    respond_to do |format|
      format.html { render :action => "index" }
      format.json { render :json => @people}
    end
  end

  # POST /people
  def create
    @person = Person.new(person_params)

    if @person.save
      render :json => @person.with_associations
    else
      render json: @person.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /people/1
  def update
    if @person.update(person_params)
      render json: @person.with_associations
    else
      render json: @person.errors, status: :unprocessable_entity
    end
  end

  # DELETE /people/1
  def destroy
    render json: @person.destroy
  end

  # GET /people/search
  def search
    ActiveRecord::Base.connection.execute("SELECT set_limit(0.20);")
    render json: Person.fuzzy_search(:name => params[:search_text]).limit(10)
  end

  private
     
    # Use callbacks to share common setup or constraints between actions.
    def set_person
      @person = Person.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def person_params
      params.require(:person).permit(:name, :email, :pidm, :sid, :emp_id, :iam_id, :cas_user, :dems_id, :cims_id)
    end
end
