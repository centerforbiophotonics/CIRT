class PersonGroup < ApplicationRecord
  belongs_to :group
  belongs_to :person

  def with_associations(parent_model: nil)
    associations = associations = {
      :person => {},
      :group => {
        :include => :group_category
      }
    }

    associations.delete(parent_model)

    self.as_json(:include => associations)
  end
end
