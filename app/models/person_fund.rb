class PersonFund < ApplicationRecord
  belongs_to :person
  belongs_to :fund

  def with_associations
    self.as_json(:include => [:person, :fund] )
  end
end
