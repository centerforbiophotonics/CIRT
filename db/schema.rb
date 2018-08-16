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

ActiveRecord::Schema.define(version: 2018_08_14_212804) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_trgm"
  enable_extension "plpgsql"

  create_table "groups", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.bigint "group_category_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
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
    t.index ["cas_user"], name: "index_people_on_cas_user", unique: true, where: "((email)::text <> ''::text)"
    t.index ["cims_id"], name: "index_people_on_cims_id", unique: true, where: "((email)::text <> ''::text)"
    t.index ["dems_id"], name: "index_people_on_dems_id", unique: true, where: "((email)::text <> ''::text)"
    t.index ["email"], name: "index_people_on_email", unique: true, where: "((email)::text <> ''::text)"
    t.index ["emp_id"], name: "index_people_on_emp_id", unique: true, where: "((email)::text <> ''::text)"
    t.index ["iam_id"], name: "index_people_on_iam_id", unique: true, where: "((email)::text <> ''::text)"
    t.index ["pidm"], name: "index_people_on_pidm", unique: true, where: "((email)::text <> ''::text)"
    t.index ["sid"], name: "index_people_on_sid", unique: true, where: "((email)::text <> ''::text)"
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

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "cas_user"
    t.string "roles"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "person_groups", "groups"
  add_foreign_key "person_groups", "people"
end
