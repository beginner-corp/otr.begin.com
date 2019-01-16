let layout = require('./layout')
let button = require('./sign-in-with-slack')

module.exports = function home() {
  return layout(`
  <p>
  Hello! <b>Off the Record</b> is a text chat where messages expire after 1 minute. 
  </p>
  <p>${button()}</p>
  `)
}
