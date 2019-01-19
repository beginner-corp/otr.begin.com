/**
 * render a socket message
 *
 * ! expects globals:
 *
 * - #team dom element
 * - #messages dom element
 * - renderTeam js function
 * - renderMessages js function
 */
export default function render(state, params) {
  let team = document.getElementById('team')
  let messages = document.getElementById('messages')
  let actions = {
    message() {
      state.messages.push(params)
      messages.innerHTML = renderMessages(state.messages)
    },
    connect() {
      state.team.push(params)
      team.innerHTML = renderTeam(state.team)
    },
    disconnect() {
      let here = a=> a.userID != params.userID
      state.team = state.team.filter(here)
      team.innerHTML = renderTeam(state.team)
    },
  }
  if (params.action && actions.hasOwnProperty(params.action)) {
    actions[params.action]()
  }
  else {
    console.log('unknown action ', params.action)
  }
}
