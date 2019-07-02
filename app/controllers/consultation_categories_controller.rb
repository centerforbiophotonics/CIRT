class ConsultationCategoriesController < ApplicationController
  before_action :set_consultation_category, only: [:update, :destroy]
  before_action :check_authorization

  # GET /consultation_categories
  def index
    @consultation_categories = ConsultationCategory.all.map{|m| [m.id, m] }.to_h
    respond_to do |format|
      format.html { render :action => "index" }
      format.json { render :json => @consultation_categoriesx}
    end
  end

  # POST /consultation_categories
  def create
    @consultation_category = ConsultationCategory.new(consultation_category_params)

    if @consultation_category.save
      render :json => @consultation_category
    else
      render json: @consultation_category.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /consultation_categories/1
  def update
    if @consultation_category.update(consultation_category_params)
      render json: @consultation_category
    else
      render json: @consultation_category.errors, status: :unprocessable_entity
    end
  end

  # DELETE /consultation_categories/1
  def destroy
    render json: @consultation_category.destroy
  end

  # GET /consultation_categories/search
  # This action is included as a placeholder for actual search logic.
  # The react component generated by default will send a search string in params[:search_text]
  def search
    render json: ConsultationCategory.first(10)
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_consultation_category
      @consultation_category = ConsultationCategory.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def consultation_category_params
      params.require(:consultation_category).permit(:name, :description)
    end

    def check_authorization
      authorize ConsultationCategory
    end
end