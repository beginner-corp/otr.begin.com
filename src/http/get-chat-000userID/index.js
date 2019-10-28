let data = require('@begin/data')
let arc = require('@architect/functions')
let chat = require('@architect/views/chat')

async function chatting(req) {

  // check to see if we are authenticated
  let loggedIn = req.session.account && req.session.loggedIn
  if (!loggedIn)
    return {location: '/?notauthorized'}

  // grab a ref to the current user
  let you = req.session.account
  let friendID = req.pathParameters.userID
  let friend
  if (friendID === you.userID) {
    friend = you
  }
  else {
    // get their friend they want to chat with
    friend = await data.get({
      table: `${you.teamID}-online`,
      key: friendID
    })
  }

  // read the inbox for this user and their fren
  let inbox = await data.get({
    table: `${you.userID}-${friend.userID}-inbox`
  })

  // render the chat template
  return {
    html: chat({account: you, state: {you, friend, inbox}})
  }
}

exports.handler = arc.http.async(chatting)
