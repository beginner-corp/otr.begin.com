import render from '/js/render.mjs'

let url = window.WS_URL
let otp = window.WS_OTP

export default function WS() {

  let ws = new WebSocket(url)
  ws.onopen = open
  ws.onclose = noop
  ws.onerror = noop
  ws.onmessage = message

  function send(msg) {
    ws.send(JSON.stringify(msg))
  }

  function open() {
    send({action:'connected', otp})
  }

  function noop(e) {
    console.log('noop', e)
  }

  function message(e) {
    let state = window.WS_STATE
    render(state, JSON.parse(e.data))
  }

  return {send}
}
