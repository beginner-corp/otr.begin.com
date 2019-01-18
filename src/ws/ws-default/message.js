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
        id: to.connectionID,
        payload: receivers
      })
    }


    /* unique inboxes
    let doc = table=> ({table, key, ttl, message})
    let inboxes = Array.from(new Set([
      `inbox-${from.teamID}-${from.userID}-${to.userID}`,
      `inbox-${from.teamID}-${to.userID}-${from.userID}`
    ]))

    // save the message
    await data.set(inboxes.map(doc))
    */

    /* send the message
    let recipients = Array.from(new Set([connectionID, receiver.connectionID]))
    let ws = arc.ws(event)
    await Promise.all(recipients.map(async id=> {
      // send the message to the client
      message.action = 'message'
      return ws.send({id, payload:msg})
    }))*/
  }
  catch(e) {
    console.log(e)
    return
  }
}

