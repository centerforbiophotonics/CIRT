class PersonGroup < ApplicationRecord
  belongs_to :group
  belongs_to :person

  def with_associations
    self.as_json(:include => [:group, :person] )
  end
end
