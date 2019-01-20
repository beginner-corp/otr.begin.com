let arc = require('@architect/functions')
let data = require('@begin/data')
let ssr = require('./ssr')
let layout = require('./layout')

exports.handler = async function http(req) {
  let session = await arc.http.session.read(req)
  if (session.account) {

    // create an expiring one time password
    let otp = await data.set({
      table: `otp`,
      ttl: (Date.now() + 10*1000)/1000, // expire in 10 seconds
      account: session.account,
    })

    // figure out which inbox this is
    let channel = req.params.channel.split('-')
    let teamID = channel[0]
    let userID = channel[1]
    let inbox = `inbox-${teamID}-${session.account.userID}-${userID}`

    // read the team/messages initial state
    let team = await data.get({table:`team-${otp.account.teamID}`})
    let messages = await data.get({table: inbox})

    return {
      type: 'text/html; charset=utf8',
      body: layout(ssr({otp, team, userID, messages}))
    }
  }
  else {
    return {
      status: 302,
      location: `/`
    }
  }
}
