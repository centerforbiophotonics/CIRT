class PeopleController < ApplicationController
  before_action :set_person, only: [:update, :destroy, :iam_lookup]
  before_action :check_authorization

  # GET /people
  def index
    @people = Person.first(10).map{|m|
      [m.id, (params[:shallow] ? m : m.with_associations)]
    }.to_h

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

    results = Person.fuzzy_search(:name => params[:search_text]).
      limit(10).
      map{|p| p.with_associations}

    render json: results
  end

  def iam_lookup
    @person.update_from_iam

    render json: @person.with_associations
  end

  def merge_assoc
    person1 = Person.find(params[:person1])

    PersonEvent.where(:person_id => params[:person2]).each do |pe|
      pe.person_id = params[:person1]
      pe.save!
    end

    PersonGroup.where(:person_id => params[:person2]).each do |pg|
      pg.person_id = params[:person1]
      pg.save!
    end

    PersonFund.where(:person_id => params[:person2]).each do |pf|
      pf.person_id = params[:person1]
      pf.save!
    end

    PersonConsultation.where(:person_id => params[:person2]).each do |pc|
      pc.person_id = params[:person1]
      pc.save!
    end

    PersonScantronAppointment.where(:person_id => params[:person2]).each do |ps|
      ps.person_id = params[:person1]
      ps.save!
    end

    render :json => person1.with_associations
  end

  def event_filter
    people = Person.
      where("person_events.status in (?)", params[:status].split(","))

    if params[:category].present?
      people = people.where(
        "events.event_category_id = ?",
        EventCategory.find_by_name(params[:category]).try(:id)
      )
    end

    if params[:date_start].present?
      people = people.where(
        "events.date >= ?::date",
        params[:date_start]
      )
    end

    if params[:date_end].present?
      people = people.where(
        "events.date <= ?::date + '1 day'::interval",
        params[:date_end]
      )
    end

    people = people.pluck(:id).sort!

    event_totals = {}

    Person.all.pluck(:id).each do |p_id|
      event_totals[p_id] = 0
    end

    people.each do |p|
      event_totals[p] += 1
    end

    filtered_people = []
    number = params[:number].to_i

    event_totals.each do |id, count|
      if params[:comparator] == "="
        if count == number
          filtered_people << id
        end
      elsif params[:comparator] == ">="
        if count >= number
          filtered_people << id
        end
      elsif params[:comparator] == "<="
        if count <= number
          filtered_people << id
        end
      elsif params[:comparator] == ">"
        if count > number
          filtered_people << id
        end
      elsif params[:comparator] == "<"
        if count < number
          filtered_people << id
        end
      end
    end

    render :json => filtered_people
  end

  def group_filter
    groups = params[:groups].split(",")
    roles = params[:roles].split(",")

    if
      groups.length == 0 &&
      roles.length == 0

      render :json => Person.all.pluck(:id)
    else
      people = Person.where(
        "person_groups.group_id in (?) or person_groups.role in (?)",
        params[:groups].split(","),
        params[:roles].split(",")
      )

      render :json => people.pluck(:id)
    end
  end

  private

    # Use callbacks to share common setup or constraints between actions.
    def set_person
      @person = Person.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def person_params
      params.require(:person).permit(:name, :email, :pidm, :sid, :emp_id, :iam_id, :cas_user, :dems_id, :cims_id, :lms_id, :additional_emails)
    end

    def check_authorization
      authorize Person
    end
end
