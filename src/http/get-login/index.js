let arc = require('@architect/functions')
let slack = require('./slack')

exports.handler = async function http(req) {
  try {
    // read the session and slack account
    let session = await arc.http.session.read(req)
    let account = await slack(req)

    // write the new session state
    let state = {...session, account}
    let cookie = await arc.http.session.write(state)

    // redirect to /
    return {
      cookie,
      status: 302,
      location: `/${account.teamID}-${account.userID}`
    }
  }
  catch(e) {
    return {
      type: 'text/html',
      status: 500,
      body: `<h1>${e.message}</h1><pre>${e.stack}</pre>`
    }
  }
}
