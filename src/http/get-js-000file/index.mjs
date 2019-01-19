import WS from '/js/websocket.mjs'

let chat = document.getElementById('chat')
let msg = document.getElementById('msg')
let websocket = new WS()

chat.onsubmit = function submit(e) {
  e.preventDefault()
  let path = window.location.pathname.replace('/', '').split('-')
  let teamID = path[0]
  let userID = path[1]
  let text = msg.value
  if (text.length > 0) {
    websocket.send({
      action: 'message',
      teamID,
      userID,
      text,
    })
  }
  msg.value = ''
  return false
}
