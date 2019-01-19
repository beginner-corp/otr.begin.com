let getUrl = require('./get-ws-url')
let renderTeam = require('@architect/views/team')
let renderMessages = require('@architect/views/messages')

/**
 * serverless side render of the app chrome
 */
module.exports = function ssr({team, messages, otp}) {
  return `
<main>
  <nav>
    <h1>Off the Record</h1>
    <form id=logout action=/logout method=post>
      <button type=submit>Sign out</button>
    </form>
    <section id=team>${renderTeam(team)}</section>
  </nav>
  
  <section id=messages>${renderMessages(messages)}</section>
  
  <form id=chat>
    <input type=text id=msg placeholder="Message text here" autofocus>
    <button type=submit>Send</button>
  </form>
</main>
  
<script>
window.WS_OTP = '${otp.key}'
window.WS_URL = '${getUrl()}'
window.WS_STATE = {
  team: ${JSON.stringify(team)},
  messages: ${JSON.stringify(messages)},
}

// inline the functions for universal render!
// these are called by /js/chat.mjs
${renderTeam.toString()}
${renderMessages.toString()}
</script>`
}
