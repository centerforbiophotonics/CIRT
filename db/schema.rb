# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_04_30_000357) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_trgm"
  enable_extension "plpgsql"

  create_table "consultation_categories", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "consultations", force: :cascade do |t|
    t.string "description"
    t.string "dates"
    t.string "consultants"
    t.string "minutes"
    t.bigint "consultation_category_id"
    t.integer "ccrc_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["consultation_category_id"], name: "index_consultations_on_consultation_category_id"
  end

  create_table "event_categories", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "events", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.date "date"
    t.bigint "event_category_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "tags"
    t.index ["event_category_id"], name: "index_events_on_event_category_id"
  end

  create_table "funds", force: :cascade do |t|
    t.integer "amount"
    t.string "name"
    t.string "description"
    t.date "date"
    t.boolean "external"
    t.string "source"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "group_categories", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "groups", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.bigint "group_category_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "ancestry"
    t.index ["ancestry"], name: "index_groups_on_ancestry"
    t.index ["group_category_id"], name: "index_groups_on_group_category_id"
    t.index ["name"], name: "index_groups_on_name", unique: true
  end

  create_table "people", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.integer "pidm"
    t.integer "sid"
    t.integer "emp_id"
    t.integer "iam_id"
    t.string "cas_user"
    t.integer "dems_id"
    t.integer "cims_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "lms_id"
    t.string "additional_emails"
    t.boolean "do_not_contact", default: false
  end

  create_table "person_consultations", force: :cascade do |t|
    t.bigint "person_id"
    t.bigint "consultation_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["consultation_id"], name: "index_person_consultations_on_consultation_id"
    t.index ["person_id"], name: "index_person_consultations_on_person_id"
  end

  create_table "person_events", force: :cascade do |t|
    t.bigint "person_id"
    t.bigint "event_id"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["event_id"], name: "index_person_events_on_event_id"
    t.index ["person_id"], name: "index_person_events_on_person_id"
  end

  create_table "person_funds", force: :cascade do |t|
    t.bigint "person_id"
    t.bigint "fund_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["fund_id"], name: "index_person_funds_on_fund_id"
    t.index ["person_id"], name: "index_person_funds_on_person_id"
  end

  create_table "person_groups", force: :cascade do |t|
    t.bigint "group_id"
    t.bigint "person_id"
    t.string "role"
    t.date "start"
    t.date "end"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["group_id"], name: "index_person_groups_on_group_id"
    t.index ["person_id"], name: "index_person_groups_on_person_id"
  end

  create_table "person_scantron_appointments", force: :cascade do |t|
    t.bigint "person_id"
    t.bigint "scantron_appointment_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["person_id"], name: "index_person_scantron_appointments_on_person_id"
    t.index ["scantron_appointment_id"], name: "index_person_scantron_appointments_on_scantron_appointment_id"
  end

  create_table "roles", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "ancestry"
    t.index ["ancestry"], name: "index_roles_on_ancestry"
  end

  create_table "scantron_appointments", force: :cascade do |t|
    t.date "date"
    t.string "course"
    t.string "term_code"
    t.integer "number_of_scantrons"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "cas_user"
    t.string "roles"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "consultations", "consultation_categories"
  add_foreign_key "events", "event_categories"
  add_foreign_key "groups", "group_categories"
  add_foreign_key "person_consultations", "consultations"
  add_foreign_key "person_consultations", "people"
  add_foreign_key "person_events", "events"
  add_foreign_key "person_events", "people"
  add_foreign_key "person_funds", "funds"
  add_foreign_key "person_funds", "people"
  add_foreign_key "person_groups", "groups"
  add_foreign_key "person_groups", "people"
  add_foreign_key "person_scantron_appointments", "people"
  add_foreign_key "person_scantron_appointments", "scantron_appointments"
end
