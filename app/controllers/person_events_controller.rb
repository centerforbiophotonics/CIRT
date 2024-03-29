class PersonEventsController < ApplicationController
  before_action :set_person_event, only: [:update, :destroy]
  before_action :check_authorization

  # GET /person_events
  def index
    @person_events = PersonEvent.all.map{|m| [m.id, m.with_associations] }.to_h
    respond_to do |format|
      format.html { render :action => "index" }
      format.json { render :json => @person_eventsx}
    end
  end

  # POST /person_events
  def create
    @person_event = PersonEvent.new(person_event_params)

    if @person_event.save
      render :json => @person_event.with_associations
    else
      render json: @person_event.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /person_events/1
  def update
    if @person_event.update(person_event_params)
      render json: @person_event.with_associations
    else
      render json: @person_event.errors, status: :unprocessable_entity
    end
  end

  # DELETE /person_events/1
  def destroy
    render json: @person_event.destroy
  end

  # GET /person_events/search
  # This action is included as a placeholder for actual search logic.
  # The react component generated by default will send a search string in params[:search_text]
  def search
    render json: PersonEvent.first(10)
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_person_event
      @person_event = PersonEvent.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def person_event_params
      params.require(:person_event).permit(:person_id, :event_id, :status)
    end

    def check_authorization
      authorize PersonEvent
    end
end
