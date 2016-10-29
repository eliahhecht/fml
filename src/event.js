var mtg = require('mtgtop8')

var store = require('./store')()

function scrapeEvents () {
  mtg.standardEvents(1, function (err, events) {
    if (err) return console.error(err)

    console.log('events fetched')

    events = [ events[0] ]
    // Get player results and decks about a specific event
    events.forEach((eventInfo) => {
      var eventId = eventInfo.id
      store.eventExists(eventId, (exists) => {
        if (exists) {
          console.log(`event ${eventId} already exists`)
          return
        }
        mtg.event(eventId, (err, event) => {
          if (err) return console.error(err)
          store.insertEvent(eventId, event.date, () => {
            console.log(`done inserting ${eventId}`)
            // todo store.insertEventCard
          })
        })
      })
    })
  })
}

exports.scrapeEvents = scrapeEvents
