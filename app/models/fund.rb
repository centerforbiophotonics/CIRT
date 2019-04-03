class Fund < ApplicationRecord
  has_many :person_funds, :dependent => :destroy
  has_many :people, :through => :person_funds

  has_ancestry

  def with_associations
    self.as_json(:include => :person_funds)
  end
end
