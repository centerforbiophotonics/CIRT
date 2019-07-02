class Consultation < ApplicationRecord
  belongs_to :consultation_category

  serialize :consultants, Array
  serialize :dates, Array
  serialize :minutes, Array

  has_many :person_consultations, :dependent => :destroy
  has_many :people, :through => :person_consultations

  default_scope {includes :consultation_category}
end
