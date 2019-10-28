let http = require('tiny-json-http')

module.exports = async function slack(req) {

  // trade the code for an access token
  let access = await http.get({
    url: `https://slack.com/api/oauth.access`,
    data: {
      client_id: process.env.SLACK_CLIENT_ID.replace('"', ''),
      client_secret: process.env.SLACK_CLIENT_SECRET,
      redirect_uri:  process.env.SLACK_CLIENT_REDIRECT,
      code: req.query.code
    }
  })

  if (access.body.ok === false)
    throw Error(access.body.error)

  // get the user account
  let account = await http.get({
    url: 'https://slack.com/api/users.identity',
    data: {
      token: access.body.access_token
    }
  })

  // construct an account obj
  return {
    teamID: account.body.team.id,
    userID: account.body.user.id,
    name: account.body.user.name,
    team: account.body.team.name,
    email: account.body.user.email,
    avatar: account.body.user.image_48
  }
}
