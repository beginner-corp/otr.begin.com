//let data = require('@begin/data')
module.exports = async function disconnected({payload, connectionID}) {
  // delete the doc in connections
  console.log('disconnected called with', payload, connectionID)
  // delete the active user
}

