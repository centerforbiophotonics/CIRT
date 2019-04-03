class Event < ApplicationRecord
  belongs_to :event_category

  serialize :tags, Array

  has_many :person_events, :dependent => :destroy
  has_many :people, :through => :person_events

  default_scope {includes :event_category} 

  def with_associations
    self.as_json(:include => :event_category, :methods => [:person_events])
  end

  def person_events
    super.map{|pe| [pe.id, pe]}.to_h
  end
end
