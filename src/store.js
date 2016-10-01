var fs = require("fs")
var file = "./test.db"
var exists = fs.existsSync(file)

if(!exists) {
  console.log("Creating DB file.")
  fs.openSync(file, "w")
}

var sqlite3 = require("sqlite3").verbose()
var db = new sqlite3.Database(file)

var startup = function() {
  db.serialize(function() {
    if(!exists) {
      var createUser = `
CREATE TABLE user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email CHAR(50) NOT NULL
)`
      var createLeague = `
CREATE TABLE league (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name CHAR(100) NOT NULL
)`
      var createMember = `
CREATE TABLE member (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  league_id INTEGER,
  FOREIGN KEY(user_id) REFERENCES user(id),
  FOREIGN KEY(league_id) REFERENCES league(id)
)`
      var createCardStatus = `
CREATE TABLE card_status (
  member_id INTEGER,
  card_name CHAR(50) NOT NULL,
  status INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(member_id) REFERENCES member(id)
)`
      var createWaiver = `
CREATE TABLE waiver (
  member_id INTEGER,
  card_name_add CHAR(50),
  card_name_drop CHAR(50),
  priority INTEGER,
  was_successful BOOLEAN NULLABLE,
  processed_at TIMESTAMP,
  FOREIGN KEY(member_id) REFERENCES member(id)
)`
      db.run(createUser)
      db.run(createLeague)
      db.run(createMember)
      db.run(createCardStatus)
      db.run(createWaiver)

      db.run("INSERT INTO user (email) VALUES ('jtms@aol.com')")
      db.run("INSERT INTO league (name) VALUES ('Jacetice League')")
      db.run("INSERT INTO member (user_id, league_id) VALUES (1, 1)")
    }

    db.each("SELECT * FROM user", function(err, row) {
      console.log(row)
    })
    db.each("SELECT * FROM league", function(err, row) {
      console.log(row)
    })
    db.each("SELECT * FROM member", function(err, row) {
      console.log(row)
    })
  })

  db.close()
}
startup()
