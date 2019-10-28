let arc = require('@architect/functions')
let slack = require('./slack')

async function login(req) {
  try {
    // get the slack account
    let account = await slack(req)
    // redirect to /
    return {
      session: {loggedIn: true, account},
      location: `/`
    }
  }
  catch(e) {
    return {
      status: 500,
      html: `<h1>${e.message}</h1><pre>${e.stack}</pre>`
    }
  }
}

exports.handler = arc.http.async(login)
