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
  // - notify the team
  if (otp) {

    // api gateway socket connections expire in 2 hours
    let ttl = ((Date.now() + 7.2e+6) / 1000)

    // we lookup actives by teamID so lets construct that message
    let active = {
      table: `team-${otp.account.teamID}`,
      key: otp.account.userID,
      ttl,
      account: otp.account,
      action: 'connect',
      connectionID,
    }

    // we lookup connections by connectionID so we save those too
    let connection = {
      table: 'connections',
      key: connectionID,
      ttl,
      account: otp.account,
    }

    // write the account data and notify the connection
    await Promise.all([
      data.destroy(otp),
      data.set([active, connection]),
      arc.ws(event).send({id:connectionID, payload:active}),
    ])

    // notify team
    let members = await data.get({table:`team-${otp.account.teamID}`})
    if (members) {
      let notCurrent = a=> a.connectionID != connectionID
      await Promise.all(members.filter(notCurrent).map(a=> {
        return arc.ws(event).send({
          id: a.connectionID,
          payload: active
        })
      }))
    }
  }
}
