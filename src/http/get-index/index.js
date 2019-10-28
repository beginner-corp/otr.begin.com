let data = require('@begin/data')
let arc = require('@architect/functions')
let login = require('@architect/views/login')
let render = require('@architect/views/online')

async function home(req) {

  // check to see if we are authenticated
  let loggedIn = req.session.account && req.session.loggedIn
  if (loggedIn) {

    // get a list of everyone online
    let account = req.session.account
    let online = await data.get({table: `${account.team}-online`})

    // add the currently logged in person in case the socket hasn't synced yet
    if (!online.some(a=> a.userID === account.userID))
      online.push(account)

    // render the online template
    return {
      html: render({account, online})
    }
  }
  else {
    // render the sign in with slack
    // slack env vars are big decimals which js breaks so we store quoted as string
    let clientID = process.env.SLACK_CLIENT_ID.replace('"', '')
    let redirect = process.env.SLACK_CLIENT_REDIRECT
    // render the login template
    return {
      html: login({clientID, redirect})
    }
  }
}

exports.handler = arc.http.async(home)
