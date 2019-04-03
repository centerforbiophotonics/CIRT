class User < ApplicationRecord
   serialize :roles, Array
end
