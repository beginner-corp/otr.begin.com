let connected = require('./connected')
let message = require('./message')

exports.handler = async function ws(event) {
  //console.log(JSON.stringify(event, null, 2))
  let payload = JSON.parse(event.body)
  let connectionID = event.requestContext.connectionId
  let actions = {
    connected,
    message
  }
  let action = payload.action
  if (action && actions.hasOwnProperty(action)) {
    await actions[action].call({}, {event, payload, connectionID})
  }
  else {
    console.log('payload.action unknown', JSON.stringify(payload, null, 2))
  }
  return {statusCode: 200}
}
