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
      db.run("CREATE TABLE user (id INTEGER PRIMARY KEY AUTOINCREMENT, email CHAR(50))")

      var stmt = db.prepare("INSERT INTO user (email) VALUES ('jtms@aol.com')")
      stmt.run()
      stmt.finalize()
    }

    db.each("SELECT u.id, u.email FROM user u", function(err, row) {
      console.log(row.id + ": " + row.email)
    })
  })

  db.close()
}
startup()
