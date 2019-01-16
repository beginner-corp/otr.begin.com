export default async function main() {

  let url = window.WS_URL
  let otp = window.WS_OTP

  let ws = new WebSocket(url)
  ws.onopen = open
  ws.onclose = close
  ws.onerror = error
  ws.onmessage = message

  function send(msg) {
    ws.send(JSON.stringify(msg))
  }
  
  function open() {
    send({action:'connected', otp})
  }

  function close(e) {
    send({action:'disconnected'})
    console.log('close called with', e)
  }

  function error(e) {
    console.log('error called with', e)
  }

  function message(e) {
    let msg = JSON.parse(e.data)
    console.log('msg', msg)
  }

  let msg = document.getElementById('message')
  msg.onsubmit = function(e) {
    e.preventDefault()
    let path = window.location.pathname.replace('/', '').split('-')
    let teamID = path[0]
    let userID = path[1]
    let text = document.getElementById('msg').value
    send({
      action: 'message',
      teamID,
      userID,
      text,
    })
    return false
  }
}

// run
main()
