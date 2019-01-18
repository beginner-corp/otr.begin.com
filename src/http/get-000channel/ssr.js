let getUrl = require('./get-ws-url')

function renderTeam(team) {
  // ensure team is a unique list
  let ids = Array.from(new Set(team.map(p=> p.account.userID)))
  let ppl = ids.map(id=> team.find(p=> p.account.userID === id)).map(p=> p.account)
  let one = p=> `<a href=/${p.teamID}-${p.userID}>${p.name}</a>`
  return ppl.map(one).join('')
}

function renderMessages(messages) {
  let msgs = messages.map(function fmt(m) {
    return {
      key: m.key,
      text: m.message.text,
      name: m.message.from.name,
      avatar: m.message.from.avatar
    }
  })
  let one = m=> `
    <div class=user-message>
      <img src=${m.avatar} alt="${m.name}">
      <div>
        <b>${m.name}</b>
        <p>${m.text}</p>
      </div>
    </div>
    `
  return msgs.map(one).join('')
}

module.exports = function ssr({team, messages, otp}) {
  return `
<main>
  <section class=left-column>
    <h1>OTR</h1>
    <form action=/logout method=post>
      <button type=submit>Sign out</button>
    </form>
    <section id=team>${renderTeam(team)}</section>
  </section>
  <section id=messages>${renderMessages(messages)}</section>
</main>
<form id=message>
  <input type=text id=msg placeholder="Message text here">
  <button type=submit>Send</button>
</form>
  
<script>
window.WS_OTP = '${otp.key}'
window.WS_URL = '${getUrl()}'
window.WS_STATE = {
  team: ${JSON.stringify(team)},
  messages: ${JSON.stringify(messages)},
}

window.WS_RENDER = function reduxish(params) {

  if (params.action === 'message') {
    window.WS_STATE.messages.push(params)
    messages.innerHTML = renderMessages(window.WS_STATE.messages)
  }

  if (params.action === 'connect') {
    window.WS_STATE.team.push(params)
    team.innerHTML = renderTeam(window.WS_STATE.team)
  }

  if (params.action === 'disconnect') {
    let here = a=> a.userID != params.userID
    window.WS_STATE.team = window.WS_STATE.team.filter(here)
    team.innerHTML = renderTeam(window.WS_STATE.team)
  }

  // universal render!
  ${renderTeam.toString()}
  ${renderMessages.toString()}
} 
</script>
  `
}
