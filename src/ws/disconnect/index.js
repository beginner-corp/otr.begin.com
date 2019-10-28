let arc = require('@architect/functions')
let data = require('@begin/data')

exports.handler = async function disconnect(req) {

  // read the current connection
  let connection = await data.get({
    table: 'connections',
    key: req.requestContext.connectionId
  })

  // all we need
  let {teamID, userID} = connection

  // remove the record
  await data.destroy(connection)

  // get any additional connections; maybe they opened a tab
  let connections = await data.get({table: 'connections'})
  let connected = connections.some(a=> a.userID === userID)

  // if this person is no longer connected anywhere
  // remove the 'online' record
  if (!connected) {
    await data.destroy({
      table: `${teamID}-online`,
      key: userID
    })
  }

  // update any connected team members
  await arc.events.publish({
    name: 'online',
    payload: {teamID}
  })

  return {statusCode: 200}
}
