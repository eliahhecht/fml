var fs = require('fs')
var debug = require('debug')('fml:store')
var file = './test.db'

var exists = fs.existsSync(file)
if (!exists) {
  console.log('Creating DB file.')
  fs.openSync(file, 'w')
}

var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database(file)

function insertCardStatus (memberId, cardName, statusCode, callback) {
  db.run(
    'INSERT INTO card_status (member_id, card_name, status_code) VALUES ($member_id, $card_name, $status_code)',
    { $member_id: memberId, $card_name: cardName, $status_code: statusCode },
    function (err, res) {
      if (err) {
        console.log(err)
      }
      callback(res)
    }
  )
}

function loadRosterByMemberId (memberId, callback) {
  var rosterQuery = `
SELECT t1.*
FROM card_status t1
JOIN (
  SELECT card_name, MAX(id) id
  FROM card_status
  WHERE member_id = $member_id
  GROUP BY card_name
) t2
ON t1.id = t2.id
AND t1.status_code in (0,1)
`
  db.all(
    rosterQuery,
    { $member_id: memberId },
    function (err, rows) {
      if (err) {
        debug(err)
      }
      callback(rows)
    }
  )
}

/** Inserts a new league. The callback will be called with the ID of the newly inserted league. */
function insertLeague (callback) {
  var insertQuery = `
INSERT INTO league (name)
VALUES ('')
`
  db.get(insertQuery,
  function (err, row) {
    if (err) {
      debug(err)
    }
    if (callback) {
      callback(this.lastID)
    }
  })
}

function initialize () {
  db.serialize(function () {
    if (!exists) {
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
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER,
  card_name CHAR(50) NOT NULL,
  status_code INTEGER NOT NULL,
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
      db.run('INSERT INTO member (user_id, league_id) VALUES (1, 1)')
      insertCardStatus(1, 'Bring to Light', 0, function () {})
      insertCardStatus(1, 'Shambling Vent', 0, function () {})
      insertCardStatus(1, "Smuggler's Copter", 0, function () {})
      insertCardStatus(1, 'Chandra, Pyrogenius', 0, function () {})
      insertCardStatus(1, 'Chandra, Pyrogenius', 1, function () {})
      insertCardStatus(1, 'Mountain', 0, function () {})
      insertCardStatus(1, 'Mountain', 2, function () {})
    }

    db.each('SELECT * FROM user', function (err, row) {
      debug(err, row)
    })
    db.each('SELECT * FROM league', function (err, row) {
      debug(err, row)
    })
    db.each('SELECT * FROM member', function (err, row) {
      debug(err, row)
    })
  })
  // hmmmmmm
  // db.close()
}
initialize() // run on module load
loadRosterByMemberId(1, debug)

exports.insertCardStatus = insertCardStatus
exports.loadRosterByMemberId = loadRosterByMemberId
exports.insertLeague = insertLeague
