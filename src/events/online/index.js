let arc = require('@architect/functions')
let data = require('@begin/data')

/**
 * publishes {action: 'online', online} to every connection with the given teamID
 *
 * @param {Object} params
 * @param {String} params.teamID
 * @returns {Promise} that resolves to a bunch of arc.ws.send calls
 */
async function online({teamID}) {

  // read back all connections with the same teamID
  let connections = await data.get({table: 'connections'})
  let team = connections.filter(c=> c.teamID === teamID)

  // read all of teamID-online
  let online = await data.get({table: `${teamID}-online`})
  let payload = {action: 'online', online}

  // unfortunately we can't cleanup GoneException causing connectionIds here
  // because said connectionId may not be registered yet
  let broadcast = team.map(function publish(connection) {
    return arc.ws.send({id: connection.key, payload}).catch(function swallow(err) {
      if (err.code != 'GoneException')
        console.log(err)
      return
    })
  })

  // broadcast to all
  return Promise.all(broadcast)
}

exports.handler = arc.events.subscribe(online)
