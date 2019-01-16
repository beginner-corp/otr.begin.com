let data = require('@begin/data')
let layout = require('./layout')
let getUrl = require('./get-ws-url')

module.exports = async function chat({otp, inbox}) {
  let account = otp.account
  let ppl = await data.get({table:`team-${account.teamID}`})
  let messages = await data.get({table:inbox})
  let body = `
<form action=/logout method=post>
  <button type=submit>Sign out</button>
</form>

<section id=team>
  ${renderTeam(ppl)}
</section>

<section id=messages>
${JSON.stringify(messages, null, 2)}
</section>

<form id=message>
<input type=text id=msg placeholder="Message text here">
<button type=submit>Send</button>
</form>
  
<script>
window.WS_OTP = '${otp.key}'
window.WS_URL = '${getUrl()}'
</script>
  `
  return layout(body)
}

function renderTeam(ppl) {
  let result = '<ul>'
  ppl.forEach(person=> {
    result += `
      <li id=${person.account.userID}>
      <a href=/${person.account.teamID}-${person.account.userID}>
      <img src=${person.account.avatar} alt=${person.account.name}>
      ${person.account.name}
      </a>
      </li>
    `
  })
  return result + '</ul>'
}
