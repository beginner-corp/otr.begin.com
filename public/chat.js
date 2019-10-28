// get the WebSocket url from the backend
let url = window.WS_URL

// all the DOM nodes this script will mutate
let main = document.getElementsByTagName('main')[0]
let msg = document.getElementById('message')

// setup the WebSocket
let ws = new WebSocket(url)
ws.onopen = render
ws.onclose = close
ws.onmessage = update
ws.onerror = console.log

// renders window.STATE.inbox
function render() {
  let inbox = window.STATE.inbox
  main.innerHTML = `<pre><code>${JSON.stringify(inbox, null, 2)}</code></pre>`
}

// report a closed WebSocket connection
function close() {
  main.innerHTML = 'Closed <a href=/>reload</a>'
}

// update window.STATE.inbox
function update(e) {
  try {
    let msg = JSON.parse(e.data)
    if (msg.action && msg.action === 'message') {
      window.STATE.inbox = window.STATE.inbox.concat([msg])
      render()
    }
    else {
      console.log('Unknown', msg)
    }
  }
  catch(err) {
    console.log(e)
    window.STATE.errors = [err]
    render()
  }
}

// sends messages to the lambda
msg.addEventListener('keyup', function(e) {
  if (e.key == 'Enter') {
    let reciever = window.STATE.friend.userID
    let message = e.target.value // get the text
    e.target.value = ''       // clear the text
    ws.send(JSON.stringify({action:'message', message, reciever}))
  }
})
