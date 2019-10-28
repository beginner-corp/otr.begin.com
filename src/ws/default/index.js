let data = require('@begin/data')
let update = require('./update')

/**
 * @param {object} req
 * @param {object} req.requestContext
 * @param {string} req.requestContext.messageId
 * @param {string} req.requestContext.connectionId
 * @param {number} req.requestContext.requestTimeEpoch
 * @param {JSON} req.body
 */
exports.handler = async function ws(req) {

  // five mins from now in seconds
  let timeout = ~~(new Date().getTime() / 1000) + (60 * 5)

  // grab the connection
  let connection = await data.get({
    table: 'connections',
    key: req.requestContext.connectionId
  })

  let msg = JSON.parse(req.body)

  if (connection && msg && msg.reciever && msg.action && msg.action === 'message') {
    msg.key = req.requestContext.messageId
    msg.sender = connection.userID
    msg.ts = req.requestContext.requestTimeEpoch
    msg.ttl = msg.ts + timeout

    // save the message to the sender and receiver inboxess
    let saves = [{...msg, table: `${msg.sender}-${msg.reciever}-inbox`}]
    if (msg.sender != msg.reciever)
      saves.push({...msg, table: `${msg.reciever}-${msg.sender}-inbox`})

    await data.set(saves)

    await update(msg)
  }

  return {statusCode: 200}
}
