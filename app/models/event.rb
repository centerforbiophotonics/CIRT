class Event < ApplicationRecord
  serialize :tags, Array

  has_many :person_events, :dependent => :destroy
  has_many :people, :through => :person_events
  belongs_to :event_category

  default_scope {includes :event_category}

  def person_events
    super.map{|pe| [pe.id, pe.with_associations(parent_model: :event)]}.to_h
  end

  def with_associations
    self.as_json(:include => :event_category, :methods => [:person_events])
  end
end
