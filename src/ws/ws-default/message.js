let data = require('@begin/data')
let aws = require('aws-sdk')

module.exports = async function message({event, payload, connectionID}) {

  // get the sender
  let sender = await data.get({
    table: `connections`,
    key: connectionID
  })

  // silently exit if we don't know this person
  if (!sender.account)
    return

  // if we do, ensure they are on the same team
  let receiver = await data.get({
    table: `team-${sender.account.teamID}`,
    key: payload.userID,
  })

  // exit if we don't have a recipient record
  if (!receiver.account)
    return

  // save the message for 1 minute
  let key = new Date(Date.now()).toISOString()
  let ttl = (Date.now() + 60*1000)/1000
  let to = receiver.account
  let from = sender.account
  let doc = table=> ({table, key, to, from, ttl, text: payload.text})

  // unique inboxes
  let inboxes = Array.from(new Set([
    `inbox-${from.teamID}-${from.userID}-${to.userID}`,
    `inbox-${from.teamID}-${to.userID}-${from.userID}`
  ]))

  // save the message
  await data.set(inboxes.map(doc))

  // send the message
  let apiVersion = '2018-11-29'
  let apiId = event.requestContext.apiId
  let region = process.env.AWS_REGION
  let stage = process.env.NODE_ENV
  let endpoint = `https://${apiId}.execute-api.${region}.amazonaws.com/${stage}`
  let gateway = new aws.ApiGatewayManagementApi({apiVersion, endpoint})
  let recipients = Array.from(new Set([connectionID, receiver.connectionID]))

  await Promise.all(recipients.map(ConnectionId=> {
    return gateway.postToConnection({
      ConnectionId,
      Data: payload.text
    }).promise()
  }))
}
