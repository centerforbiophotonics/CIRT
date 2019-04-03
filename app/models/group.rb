class Group < ApplicationRecord
  has_many :person_groups, :dependent => :destroy
  has_many :people, :through => :person_groups
  belongs_to :group_category, :optional => true

  validates_uniqueness_of :name, :allow_blank => true, :allow_nil => true

  def with_associations
    self.as_json(:include => [:group_category, :person_groups])
  end
end
