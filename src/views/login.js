module.exports = function login({clientID, redirect}) {
  return `<!doctype html>
<html>
<body>
<h1>Sign in</h1>
<p>
Once signed in you can chat with a coworker.
</p>
<a href="https://slack.com/oauth/authorize?scope=identity.basic,identity.email,identity.team,identity.avatar&client_id=${clientID}&redirect_uri=${redirect}"><img alt=""Sign in with Slack"" height="40" width="172" src="https://platform.slack-edge.com/img/sign_in_with_slack.png" srcset="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x" /></a>
</body>
</html>`
}
