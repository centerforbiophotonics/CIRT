class Fund < ApplicationRecord
  has_many :person_funds, :dependent => :destroy
  has_many :people, :through => :person_funds

  has_ancestry

  def person_funds
    super.map{|pf| [pf.id, pf.with_associations(parent_model: :fund)]}.to_h
  end

  def with_associations
    self.as_json(:include => :person_funds)
  end
end
