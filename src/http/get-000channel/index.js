let arc = require('@architect/functions')
let data = require('@begin/data')
let chat = require('./chat')

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
    return {
      type: 'text/html; charset=utf8',
      body:  await chat({otp, inbox})
    }
  }
  else {
    return {
      status: 302,
      location: `/`
    }
  }
}
