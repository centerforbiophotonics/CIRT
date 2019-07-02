class PersonFund < ApplicationRecord
  belongs_to :person
  belongs_to :fund

  def with_associations(parent_model: nil)
    associations = [:person, :fund]
    associations.delete(parent_model)

    self.as_json(:include => associations)
  end
end
