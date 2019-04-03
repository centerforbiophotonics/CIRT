class Role < ApplicationRecord
  has_ancestry

  # default_scope {includes :children, :parent} 

  def with_associations
    self.as_json(:include => [:children, :parent])
  end
end
