module.exports = function renderMessages(messages) {
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
