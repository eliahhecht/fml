var RosterEntry = React.createClass({
	render: function() {
		return(
			<tr>
				<td>
					{this.props.data.position}
				</td>
				<td>
					{this.props.data.name}
				</td>
			</tr>
		)
	}
});

var Roster = React.createClass({

	render: function() {
		var rosterItemNodes = this.props.rosterItems.map(function(item) {
			return(
				<RosterEntry data={item} key={item.name}/>
			)
		});

		console.log(rosterItemNodes)

		return(
			<table className="table">
				<thead>
					<tr>
						<th>Position</th>
						<th>Name</th>
					</tr>
				</thead>
				<tbody>
					{ rosterItemNodes }
				</tbody>
			</table>
		)
	}
})

ReactDOM.render(
    <Roster rosterItems={window.bootstrapRosterData} />,
    document.getElementById('roster')
);