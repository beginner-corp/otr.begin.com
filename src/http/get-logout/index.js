let arc = require('@architect/functions')

function logout() {
  return {
    session: {loggedIn: false},
    location: `/`
  }
}

exports.handler = arc.http.async(logout)
