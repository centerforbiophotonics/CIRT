class Group < ApplicationRecord
  has_many :person_groups, :dependent => :destroy
  has_many :people, :through => :person_groups

  validates_uniqueness_of :name, :allow_blank => true, :allow_nil => true
end
