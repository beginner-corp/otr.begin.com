let tiny = require('tiny-json-http')
let redirect = require('@architect/shared/get-slack-redirect')

// oauth w slack
module.exports = async function slack(req) {

  // trade the code for an access token
  let result = await tiny.get({
    url: `https://slack.com/api/oauth.access`,
    data: {
      client_id: process.env.SLACK_CLIENT_ID.replace('"', ''),
      client_secret: process.env.SLACK_CLIENT_SECRET,
      code: req.query.code,
      redirect_uri: redirect(),
    }
  })

  if (result.body.ok === false)
    throw Error(result.body.error)

  // handy dandy slack token
  let token = result.body.access_token

  // get the user account
  let account = await tiny.get({
    url: 'https://slack.com/api/users.identity',
    data: {token}
  })

  // construct an account obj
  let teamID = account.body.team.id
  let userID = account.body.user.id
  let name = account.body.user.name
  let team = account.body.team.name
  let email = account.body.user.email
  let avatar = account.body.user.image_48

  return {teamID, userID, name, team, email, avatar}
}
