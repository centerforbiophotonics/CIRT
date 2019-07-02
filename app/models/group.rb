class Group < ApplicationRecord
  has_ancestry

  has_many :person_groups, :dependent => :destroy
  has_many :people, :through => :person_groups
  belongs_to :group_category, :optional => true

  validates_uniqueness_of :name, :allow_blank => true, :allow_nil => true

  default_scope {includes :group_category}

  def person_groups
    super.map{|pg| [pg.id, pg.with_associations(parent_model: :group)]}.to_h
  end

  def with_associations
    self.as_json(
      :include => [:group_category],
      :methods => [:parent, :parent_id, :person_groups]
    )
  end

end
