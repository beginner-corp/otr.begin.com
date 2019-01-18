let arc = require('@architect/functions')
let data = require('@begin/data')

module.exports = async function connected({event, payload, connectionID}) {
  // lookup the one time password
  let otp = await data.get({
    table: 'otp',
    key: payload.otp
  })
  // if it exists
  // - delete the otp record
  // - save a new active user
  // - save the connection
  if (otp) {
    // lookup actives by teamID
    let active = {
      table: `team-${otp.account.teamID}`,
      key: otp.account.userID,
      account: otp.account,
      action: 'connect',
      connectionID,
    }
    // lookup connections by connectionID
    let connection = {
      table: 'connections',
      key: connectionID,
      account: otp.account,
    }
    // work as quickly as possible
    await Promise.all([
      data.destroy(otp),
      data.set([active, connection]),
      arc.ws(event).send({id:connectionID, payload:active})
    ])
  }
}
