let layout = require('./_layout')

module.exports = function render({account, state}) {
  return layout({account, state, js: 'chat.js'})
}

/*
function c(: {you, friend, inbox}) {
  return `<!doctype html>
<html>
<link rel=stylesheet type=text/css href=${_static('index.css')}>
<body>

<h1>Chatting with ${you.userID === friend.userID? 'yourself' : friend.name}</h1>
<a href=/>go home</a>

<nav>
  <div>
    <img src=${you.avatar}>
    <h3><a href=/logout>Logout ${you.name}</a></h3>
  </div>
  <div>
    <img src=${friend.avatar}>
    <h3>${friend.name}</h3>
  </div>
</nav>

<main>
  <pre>${JSON.stringify(inbox, null, 2)}</pre>
</main>

<input type=text id=message>

<script>
window.STATE = ${JSON.stringify({you, friend, inbox}, null, 2)};
window.WS_URL = '${process.env.WSS_URL}';
</script>
<script type=module src=${_static('chat.js')}></script>
</body>
</html>`
}*/
