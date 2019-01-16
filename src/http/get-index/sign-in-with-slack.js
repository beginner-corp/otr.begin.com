module.exports = function button() {
  let client_id = process.env.SLACK_CLIENT_ID.replace('"', '')
  return `
<a href="https://slack.com/oauth/authorize?scope=identity.basic,identity.email,identity.team,identity.avatar&client_id=${client_id}&redirect_uri=${getRedirect()}"><img alt="Sign in with Slack" height="40" width="172" src="https://platform.slack-edge.com/img/sign_in_with_slack.png" srcset="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x" /></a>`
}

function getRedirect() {
  if (process.env.NODE_ENV === 'testing') {
    return 'https://localhost:3333/login'
  }
  else if (process.env.NODE_ENV === 'staging') {
    return 'https://otr-staging.begin.com/login'
  }
  else if (process.env.NODE_ENV === 'production') {
    return 'https://otr.begin.com/login'
  }
  else {
    return 'https://otr-staging.begin.com/login'

  }
}
