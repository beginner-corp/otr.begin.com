let arc = require('@architect/functions')
let data = require('@begin/data')

exports.handler = async function connect(req) {

  // read the session cookie
  let session = await arc.http.session.read(req)
  let timeout = ~~(new Date().getTime() / 1000) + (60 * 60) // hour from now

  // create a record in table `${teamID}-online`
  let account = {...session.account}
  account.table = `${account.teamID}-online`
  account.key = account.userID
  account.ttl = timeout

  // create a record in table connections
  let connection = {...session.account}
  connection.table = `connections`
  connection.key = req.requestContext.connectionId
  connection.ttl = timeout

  // batch save records
  await data.set([
    account,
    connection
  ])

  // publish an 'online' as a background event so currently connecting client gets it
  await arc.events.publish({
    name: 'online',
    payload: {teamID: account.teamID}
  })

  // complete connection
  return {statusCode: 200}
}
