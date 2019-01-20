let arc = require('@architect/functions')
let data = require('@begin/data')

module.exports = async function message({event, payload, connectionID}) {
  try {
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
    if (!receiver)
      return

    // save the message for 1 minute
    let key = new Date(Date.now()).toISOString()
    let ttl = (Date.now() + 60*1000)/1000
    let to = receiver.account
    let from = sender.account
    let message = {to, from, text: payload.text}
    let action = 'message'

    // save the message to the senders inbox
    let senders = await data.set({
      table: `inbox-${from.teamID}-${from.userID}-${to.userID}`,
      key,
      ttl,
      message,
      action,
    })

    // update their client
    let ws = arc.ws(event)
    await ws.send({
      id: connectionID,
      payload: senders
    })

    // ensure unique recipients
    let notSelf = to.userID != from.userID
    if (notSelf) {

      // save the message to the recipients inbox
      let receivers = await data.set({
        table: `inbox-${to.teamID}-${to.userID}-${from.userID}`,
        key,
        ttl,
        message,
        action,
      })

      // update their client
      await ws.send({
        id: receiver.connectionID,
        payload: receivers
      })
    }
  }
  catch(e) {
    console.log(e)
    return
  }
}

