var http = require('http')
var fs = require('fs')
function downloadDeckList (deckId) {
  var file = fs.createWriteStream(`${deckId}.txt`)
  http.get(`http://mtgtop8.com/mtgo?d=${deckId}`, function (response) {
    response.pipe(file)
  })
}

exports.downloadDeckList = downloadDeckList
