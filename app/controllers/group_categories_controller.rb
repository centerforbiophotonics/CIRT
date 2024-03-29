class GroupCategoriesController < ApplicationController
  before_action :set_group_category, only: [:update, :destroy]
  before_action :check_authorization

  # GET /group_categories
  def index
    @group_categories = GroupCategory.all.map{|m| [m.id, m] }.to_h
    respond_to do |format|
      format.html { render :action => "index" }
      format.json { render :json => @group_categoriesx}
    end
  end

  # POST /group_categories
  def create
    @group_category = GroupCategory.new(group_category_params)

    if @group_category.save
      render :json => @group_category
    else
      render json: @group_category.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /group_categories/1
  def update
    if @group_category.update(group_category_params)
      render json: @group_category
    else
      render json: @group_category.errors, status: :unprocessable_entity
    end
  end

  # DELETE /group_categories/1
  def destroy
    render json: @group_category.destroy
  end

  # GET /group_categories/search
  # This action is included as a placeholder for actual search logic.
  # The react component generated by default will send a search string in params[:search_text]
  def search
    ActiveRecord::Base.connection.execute("SELECT set_limit(0.20);")
    render json: GroupCategory.fuzzy_search(:name => params[:search_text]).limit(10)
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_group_category
      @group_category = GroupCategory.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def group_category_params
      params.require(:group_category).permit(:name, :description)
    end

    def check_authorization
      authorize GroupCategory
    end
end
