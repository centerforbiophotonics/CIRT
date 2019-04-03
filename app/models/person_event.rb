class PersonEvent < ApplicationRecord
  belongs_to :person
  belongs_to :event

  def with_associations
    self.as_json(:include => {:person => {}, :event => {:include => :event_category}})
  end
end
