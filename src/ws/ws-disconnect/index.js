let WebSocket = require('@architect/functions').ws
let data = require('@begin/data')

/**
 * tidy up old rows
 */
exports.handler = async function ws(event) {

  let ws = new WebSocket(event)
  let connectionID = event.requestContext.connectionId

  // retrieve the account
  let connection = await data.get({
    table: 'connections',
    key: connectionID
  })

  let teamID = connection.account.teamID
  let userID = connection.account.userID

  // find old rows w matching connection id in team-teamID and remove
  let team = await data.get({
    table: `team-${teamID}`,
    key: userID
  })

  // delete the connection
  await data.destroy({
    table: 'connections',
    key: connectionID
  })

  // remove from the team
  if (team.connectionID === connectionID) {
    team.action = 'disconnect'
    await Promise.all([
      data.destroy(team),
      ws.send({
        id: connectionID,
        payload: team
      })
    ])
  }

  return {statusCode: 200}
}
