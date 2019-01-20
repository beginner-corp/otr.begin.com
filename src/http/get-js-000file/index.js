let fs = require('fs')
let path = require('path')
let util = require('util')
let read = util.promisify(fs.readFile)
let type = 'text/javascript; charset=utf8'

let ok = [
  'index.mjs',
  'home.mjs',
  'render.mjs',
  'websocket.mjs',
]

/**
 * only serve known ok files
 */
exports.handler = async function http(req) {
  if (!ok.includes(req.params.file))
    return {type, status: 404, body:`console.log("${req.params.file} not found")`}
  let file = path.join(__dirname, req.params.file)
  let body = await read(file, {encoding:'utf8'})
  return {type, body}
}
