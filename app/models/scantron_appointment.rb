class ScantronAppointment < ApplicationRecord
  has_many :person_scantron_appointments, :dependent => :destroy
  has_many :people, :through => :person_scantron_appointments
end
