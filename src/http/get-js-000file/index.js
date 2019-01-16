let arc = require('@architect/functions')
let fs = require('fs')
let path = require('path')
let read = file=> fs.readFileSync(path.join(__dirname, file)).toString()
let chat = read('chat.mjs')
let home = read('home.mjs')

/**
 * only serves chat.mjs if logged in
 */
exports.handler = async function http(req) {
  let type = 'text/javascript; charset=utf8'
  let session = await arc.http.session.read(req)
  let body = session.account? chat : home
  return {type, body}
}

