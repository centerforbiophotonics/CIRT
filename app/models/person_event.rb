class PersonEvent < ApplicationRecord
  belongs_to :person
  belongs_to :event

  def with_associations(parent_model: nil)
    associations = {
      :person => {},
      :event => {
        :include => :event_category
      }
    }
    associations.delete(parent_model)

    self.as_json(:include => associations)
  end
end
