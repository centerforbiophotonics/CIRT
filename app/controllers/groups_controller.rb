class GroupsController < ApplicationController
  before_action :set_group, only: [:update, :destroy]

  # GET /groups
  def index
    @groups = Group.all.map{|m| [m.id, m] }.to_h
    respond_to do |format|
      format.html { render :action => "index" }
      format.json { render :json => @groupsx}
    end
  end

  # POST /groups
  def create
    @group = Group.new(group_params)

    if @group.save
      render :json => @group
    else
      render json: @group.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /groups/1
  def update
    if @group.update(group_params)
      render json: @group
    else
      render json: @group.errors, status: :unprocessable_entity
    end
  end

  # DELETE /groups/1
  def destroy
    render json: @group.destroy
  end

  # GET /groups/search
  def search
    render json: Group.fuzzy_search(:name => params[:search_text]).limit(10)
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_group
      @group = Group.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def group_params
      params.require(:group).permit(:name, :description, :group_category_id)
    end
end