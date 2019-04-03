class EventCategory < ApplicationRecord
  validates_uniqueness_of :name

  has_many :events
end
