class EventCategoriesController < ApplicationController
  before_action :set_event_category, only: [:update, :destroy]

  # GET /event_categories
  def index
    @event_categories = EventCategory.all.map{|m| [m.id, m] }.to_h

    respond_to do |format|
      format.html { render :action => "index" }
      format.json { render :json => @event_categories}
    end
  end

  # POST /event_categories
  def create
    @event_category = EventCategory.new(event_category_params)

    if @event_category.save
      render :json => @event_category
    else
      render json: @event_category.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /event_categories/1
  def update
    if @event_category.update(event_category_params)
      render json: @event_category
    else
      render json: @event_category.errors, status: :unprocessable_entity
    end
  end

  # DELETE /event_categories/1
  def destroy
    render json: @event_category.destroy
  end

  # GET /event_categories/search
  # This action is included as a placeholder for actual search logic.
  # The react component generated by default will send a search string in params[:search_text]
  def search
    ActiveRecord::Base.connection.execute("SELECT set_limit(0.20);")
    render json: EventCategory.fuzzy_search(:name => params[:search_text]).limit(10)
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_event_category
      @event_category = EventCategory.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def event_category_params
      params.require(:event_category).permit(:name, :description)
    end
end
