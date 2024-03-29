class PersonConsultationsController < ApplicationController
  before_action :set_person_consultation, only: [:update, :destroy]
  before_action :check_authorization

  # GET /person_consultations
  def index
    @person_consultations = PersonConsultation.all.map{|m| [m.id, m] }.to_h
    respond_to do |format|
      format.html { render :action => "index" }
      format.json { render :json => @person_consultationsx}
    end
  end

  # POST /person_consultations
  def create
    @person_consultation = PersonConsultation.new(person_consultation_params)

    if @person_consultation.save
      render :json => @person_consultation
    else
      render json: @person_consultation.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /person_consultations/1
  def update
    if @person_consultation.update(person_consultation_params)
      render json: @person_consultation
    else
      render json: @person_consultation.errors, status: :unprocessable_entity
    end
  end

  # DELETE /person_consultations/1
  def destroy
    render json: @person_consultation.destroy
  end

  # GET /person_consultations/search
  # This action is included as a placeholder for actual search logic.
  # The react component generated by default will send a search string in params[:search_text]
  def search
    render json: PersonConsultation.first(10)
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_person_consultation
      @person_consultation = PersonConsultation.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def person_consultation_params
      params.require(:person_consultation).permit(:person_id, :consultation_id)
    end

    def check_authorization
      authorize PersonConsultation
    end
end
