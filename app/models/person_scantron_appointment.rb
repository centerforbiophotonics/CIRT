class PersonScantronAppointment < ApplicationRecord
  belongs_to :person
  belongs_to :scantron_appointment

  def with_associations(parent_model: nil)
    associations = [:person, :scantron_appointment]
    associations.delete(parent_model)

    self.as_json(:include => associations)
  end
end
