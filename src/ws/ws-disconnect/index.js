let data = require('@begin/data')

/**
 * tidy up old rows
 */
exports.handler = async function ws(event) {

  let connectionID = event.requestContext.connectionId

  // retrieve the account
  let connection = await data.get({
    table: 'connections',
    key: connectionID
  })
  
  // find old rows w matching connection id in team-teamID and remove
  let team = await data.get({
    table: `team-${teamID}`
    key: userID
  }) 

  // delete stuff
  await data.destroy({
    table: 'connections',
    key: connectionID
  })

  if (team.connectionID === connectionID) {
    await data.destroy(team)
  }
  
  return {statusCode: 200}
}
