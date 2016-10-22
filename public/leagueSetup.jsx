var Store = function () {
  var self = this
  
  self.players = []
  self.addPlayer = function () {
    self.players.push({})
    render()
  }
}

var store = new Store()

var CardEntryField = React.createClass({
  
  render: function() {
    return (<input type="text" />)
  }
  
})

var PlayerName = React.createClass({
  render: function () {
    return (<input type="text" />)
  }
})

var Player = React.createClass({
  render: function() {
    var cardNodes = "";
    return (<div>
      Name: <PlayerName name={this.props.name} /><br />
      Add card: <CardEntryField />
      <ul>
        {cardNodes}
      </ul>
    </div>)
  }
})

var LeagueName = React.createClass({
  render: function () {
    return (<input type="text" />)
  }
})

var AddPlayerButton = React.createClass({
  render: function () {
    return (<button onClick={store.addPlayer}>Add Player</button>)
  }
})

var League = React.createClass({
  
  makePlayerNodes: function() {
    var playerNodes = []
    store.players.forEach(function (player) {
      playerNodes.push(<Player name="placeholder" />)
    })
    return playerNodes
  },
  
  render: function () {
    var players = this.makePlayerNodes()
    return (<div>
      <h1> League Name: <LeagueName /></h1> 
      <AddPlayerButton />
      {players}
    </div>)
  }
})

var render = function () {
  ReactDOM.render(
    <League />,
    document.getElementById("league")
  )
}
render()
