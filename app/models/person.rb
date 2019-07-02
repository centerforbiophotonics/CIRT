class Person < ApplicationRecord
  serialize :additional_emails, Array

  has_many :person_groups, :dependent => :destroy
  has_many :groups, :through => :person_groups

  has_many :person_funds, :dependent => :destroy
  has_many :funds, :through => :person_funds

  has_many :person_events, :dependent => :destroy
  has_many :events, :through => :person_events

  has_many :person_consultations, :dependent => :destroy
  has_many :consultations, :through => :person_consultations

  has_many :person_scantron_appointments, :dependent => :destroy
  has_many :scantron_appointments, :through => :person_scantron_appointments

  validates_presence_of :email, :name

  validates_uniqueness_of :email, :allow_blank => true, :allow_nil => true
  validates_uniqueness_of :pidm, :allow_blank => true, :allow_nil => true
  validates_uniqueness_of :sid, :allow_blank => true, :allow_nil => true
  validates_uniqueness_of :emp_id, :allow_blank => true, :allow_nil => true
  validates_uniqueness_of :iam_id, :allow_blank => true, :allow_nil => true
  validates_uniqueness_of :cas_user, :allow_blank => true, :allow_nil => true
  validates_uniqueness_of :dems_id, :allow_blank => true, :allow_nil => true
  validates_uniqueness_of :cims_id, :allow_blank => true, :allow_nil => true

  default_scope {includes :person_groups, :groups, :person_funds, :funds,
    :person_events, :events, :person_consultations, :consultations,
    :person_scantron_appointments, :scantron_appointments
  }

  def self.last_iam_lookup
    Date.new(2019,6,10)
  end

  def person_groups
    super.map{|pg| [pg.id, pg.with_associations(parent_model: :person)]}.to_h
  end

  def person_funds
    super.map{|pf| [pf.id, pf.with_associations(parent_model: :person)]}.to_h
  end

  def person_events
    super.map{|pe| [pe.id, pe.with_associations(parent_model: :person)]}.to_h
  end

  def person_consultations
    super.map{|pc| [pc.id, pc.with_associations(parent_model: :person)]}.to_h
  end

  def person_scantron_appointments
    super.map{|ps| [ps.id, ps.with_associations(parent_model: :person)]}.to_h
  end

  def with_associations
    self.as_json(
      :methods => [
        :person_groups,
        :person_funds,
        :person_events,
        :person_consultations,
        :person_scantron_appointments
      ]
    )
  end

  def self.update_all_from_iam only_new = true
    to_update = []
    if only_new
      to_update = Person.where("created_at > ?",last_iam_lookup)
    else
      to_update = Person.all
    end

    to_update.each do |p| p.update_from_iam end
  end

  def update_from_iam
    if cas_user.present?
      key = Rails.application.credentials.iam[:key]

      r1 = HTTParty.get("https://iet-ws.ucdavis.edu/api/iam/people/prikerbacct/search?userId=#{cas_user}&key=#{key}&v=1.0")
      r1d = JSON.parse(r1.body)

      if r1d["responseData"]["results"].length > 0
        puts "success"
        self.iam_id = r1d["responseData"]["results"][0]["iamId"]
        self.save!
      end
    elsif email.present?
      key = Rails.application.credentials.iam[:key]

      r1 = HTTParty.get("https://iet-ws.ucdavis.edu/api/iam/people/contactinfo/search?email=#{email}&key=#{key}&v=1.0")
      r1d = JSON.parse(r1.body)

      if r1d["responseData"]["results"].length > 0
        self.iam_id = r1d["responseData"]["results"][0]["iamId"]
        self.save!
      end
    else
      puts "User must have a valid kerberos user name or email."
    end

    if self.iam_id.present?
      r1 = HTTParty.get("https://iet-ws.ucdavis.edu/api/iam/people/search?iamId=#{iam_id}&key=#{key}&v=1.0")
      r1d = JSON.parse(r1.body)

      if r1d["responseData"]["results"].length > 0

        r_sid = r1d["responseData"]["results"][0]["studentId"]
        if (!self.sid.present? && r_sid.present?)
          self.sid = r_sid
        end

        r_pidm = r1d["responseData"]["results"][0]["bannerPIdM"]
        if (!self.pidm.present? && r_pidm.present?)
          self.pidm = r_pidm
        end

        r_emp_id = r1d["responseData"]["results"][0]["employeeId"]
        if (!self.emp_id.present? && r_emp_id.present?)
          self.emp_id = r_emp_id
        end

        self.save!
      end

      r2 = HTTParty.get("https://iet-ws.ucdavis.edu/api/iam/people/prikerbacct/search?iamId=#{iam_id}&key=#{key}&v=1.0")
      r2d = JSON.parse(r2.body)

      if r2d["responseData"]["results"].length > 0
        self.cas_user = r2d["responseData"]["results"][0]["userId"]
        self.save!
      end

      r3 = HTTParty.get("https://iet-ws.ucdavis.edu/api/iam/associations/pps/#{iam_id}?key=#{key}&v=1.0")
      r3d = JSON.parse(r3.body)

      if r3d["responseData"]["results"].length > 0
        r3d["responseData"]["results"].each do |pps_assoc|
          dept = pps_assoc["deptDisplayName"].titleize
          position = pps_assoc["titleDisplayName"]

          g = Group.find_or_create_by(:name => dept)

          unless PersonGroup.where(:person_id => self.id, :group_id => g.id, :role => position).exists?
            PersonGroup.create(
              :person_id => self.id,
              :group_id => g.id,
              :role => position,
              :start => pps_assoc["createDate"]
            )
          end
        end
      end

      r4 = HTTParty.get("https://iet-ws.ucdavis.edu/api/iam/associations/odr/#{iam_id}?key=#{key}&v=1.0")
      r4d = JSON.parse(r4.body)

      if r4d["responseData"]["results"].length > 0
        r4d["responseData"]["results"].each do |odr_assoc|
          dept = odr_assoc["deptDisplayName"].titleize
          position = odr_assoc["titleDisplayName"]

          g = Group.find_or_create_by(:name => dept)

          unless PersonGroup.where(:person_id => self.id, :group_id => g.id, :role => position).exists?
            PersonGroup.create(
              :person_id => self.id,
              :group_id => g.id,
              :role => position,
              :start => odr_assoc["createDate"]
            )
          end
        end
      end

      r5 = HTTParty.get("https://iet-ws.ucdavis.edu/api/iam/associations/sis/#{iam_id}?key=#{key}&v=1.0")
      r5d = JSON.parse(r5.body)

      if r5d["responseData"]["results"].length > 0
        r5d["responseData"]["results"].each do |sis_assoc|
          dept = sis_assoc["majorName"].titleize
          position = sis_assoc["levelName"]

          g = Group.find_or_create_by(:name => dept)

          unless PersonGroup.where(:person_id => self.id, :group_id => g.id, :role => position).exists?
            PersonGroup.create(
              :person_id => self.id,
              :group_id => g.id,
              :role => position,
              :start => sis_assoc["createDate"]
            )
          end
        end
      end

    end
  end

  def update_general_ucd_affiliation
    ucd = Group.where(:name => "UC Davis").first

    p = self

    aff = p.lookup_ucd_affiliations

    if aff["isStudent"]
      unless PersonGroup.where(:person_id => p.id, :group_id => ucd.id, :role => "Student").exists?
        PersonGroup.create(:person_id => p.id, :group_id => ucd.id, :role => "Student")
      end
    end

    if aff["isFaculty"]
      unless PersonGroup.where(:person_id => p.id, :group_id => ucd.id, :role => "Faculty").exists?
        PersonGroup.create(:person_id => p.id, :group_id => ucd.id, :role => "Faculty")
      end
    end

    if aff["isStaff"]
      unless PersonGroup.where(:person_id => p.id, :group_id => ucd.id, :role => "Staff").exists?
        PersonGroup.create(:person_id => p.id, :group_id => ucd.id, :role => "Staff")
      end
    end
  end

  def lookup_ucd_affiliations
    key = Rails.application.credentials.iam[:key]
    aff = {}

    if iam_id.present?
      r = HTTParty.get("https://iet-ws.ucdavis.edu/api/iam/people/affiliations/#{iam_id}?key=#{key}&v=1.0")
      rd = JSON.parse(r.body)

      if rd["responseData"]["results"].length > 0
        aff = rd["responseData"]["results"][0]
      end
    end

    return aff
  end
end
