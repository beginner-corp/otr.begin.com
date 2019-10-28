// get the WebSocket url from the backend
let url = window.WS_URL

// all the DOM nodes this script will mutate
let main = document.getElementsByTagName('nav')[0]

// setup the WebSocket
let ws = new WebSocket(url)
ws.onopen = render
ws.onclose = close
ws.onmessage = update
ws.onerror = console.log

// renders window.STATE.online
function render() {
  let online = window.STATE.online
  let li = a=> (`<li class="p-2 hover:bg-teal-600">
    <a href=/chat/${a.userID} class="flex pointer-events-auto text-white">
    <img src=${a.avatar} class="rounded w-5 mr-2">${a.name}</a>
  </li>`)
  main.innerHTML = `<ul>${online.map(li).join('')}</ul>`
}

// report a closed WebSocket connection
function close() {
  main.innerHTML = 'Closed <a href=/>reload</a>'
}

// updates window.STATE and calls render
function update(e) {
  try {
    let msg = JSON.parse(e.data)
    if (msg.action && msg.action === 'online') {
      window.STATE.online = msg.online
      render()
    }
    else {
      throw Error(`unknown action ${e.data}`)
    }
  }
  catch(err) {
    console.log(e)
    window.STATE.errors = [err]
    render()
  }
}
