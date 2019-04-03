module Iam
  def self.included(base)
    base.extend(self)
  end
 
  def update_from_iam
    require 'httparty'
    key = Rails.application.credentials.iam.key

    r1 = HTTParty.get("https://iet-ws.ucdavis.edu/api/iam/people/prikerbacct/search?userId=#{cas_user}&key=#{key}&v=1.0")
    r1d = JSON.parse(r1.body)

    if r1d["responseData"]["results"].length > 0
      iam_id = r1d["responseData"]["results"][0]["iamId"]
      save!
    end

    if iam_id.present?
      r2 = HTTParty.get("https://iet-ws.ucdavis.edu/api/iam/people/search?iamId=#{iam_id}&key=#{key}&v=1.0")
      r2d = JSON.parse(r2.body)

      if r2d["responseData"]["results"].length > 0
        sid = r2d["responseData"]["results"][0]["studentId"]
        pidm = r2d["responseData"]["results"][0]["bannerPIdM"]
        emp_id = r2d["responseData"]["results"][0]["employeeId"]
        save!
      end
    end
  end
end