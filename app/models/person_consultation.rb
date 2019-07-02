class PersonConsultation < ApplicationRecord
  belongs_to :person
  belongs_to :consultation

  def with_associations(parent_model: nil)
    associations = {
      :person => {},
      :consultation => {
        :include => :consultation_category
      }
    }
    associations.delete(parent_model)

    self.as_json(:include => associations)
  end
end
