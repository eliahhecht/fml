var RosterStatusCode = {
  Active: 0,
  Bench: 1,
  Dropped: 2,

  isValid: function(code) {
  	return code >= 0 && code <= 2
  }
}

exports.RosterStatusCode = RosterStatusCode 