class Person < ApplicationRecord
  has_many :person_groups, :dependent => :destroy 
  has_many :groups, :through => :person_groups

  validates_uniqueness_of :email, :allow_blank => true, :allow_nil => true
  validates_uniqueness_of :pidm, :allow_blank => true, :allow_nil => true
  validates_uniqueness_of :sid, :allow_blank => true, :allow_nil => true
  validates_uniqueness_of :emp_id, :allow_blank => true, :allow_nil => true
  validates_uniqueness_of :iam_id, :allow_blank => true, :allow_nil => true
  validates_uniqueness_of :cas_user, :allow_blank => true, :allow_nil => true
  validates_uniqueness_of :dems_id, :allow_blank => true, :allow_nil => true
  validates_uniqueness_of :cims_id, :allow_blank => true, :allow_nil => true

  def person_groups
    super.map{|pg| [pg.id, pg.with_associations]}.to_h
  end

  def with_associations
    self.as_json(:methods => :person_groups)
  end
end
