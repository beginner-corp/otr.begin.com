let arc = require('@architect/functions')

exports.handler = async function http() {
  let cookie = await arc.http.session.write({})
  return {
    cookie, status: 302, location: '/'
  }
}
