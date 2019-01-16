let data = require('@begin/data')

module.exports = async function connected({payload, connectionID}) {
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
      connectionID,
    }
    // lookup connections by connectionID
    let connection = {
      table: 'connections',
      key: connectionID,
      account: otp.account,
    }
    await Promise.all([
      data.destroy(otp),
      data.set([active, connection]),
    ])
  }
}
