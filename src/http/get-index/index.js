let arc = require('@architect/functions')
let home = require('./home')

exports.handler = async function http(req) {
  let session = await arc.http.session.read(req)
  if (session.account) {
    return {
      status: 302,
      location: `/${session.account.teamID}`
    }
  }
  else {
    return {
      type: 'text/html; charset=utf8',
      body:  home()
    }
  }
}
