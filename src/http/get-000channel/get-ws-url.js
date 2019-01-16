module.exports = function getUrl() {
  let testing = 'ws://localhost:3333'
  if (process.env.NODE_ENV === 'testing') {
    return testing
  }
  else if (process.env.NODE_ENV === 'staging') {
    return 'wss://a9l29irot0.execute-api.us-east-1.amazonaws.com/staging'
    //return 'wss://otp-ws-staging.begin.com'
  }
  else if (process.env.NODE_ENV === 'production') {
    return 'wss://5pa1ezu6eb.execute-api.us-east-1.amazonaws.com/production'
    //return 'wss://otp-ws.begin.com'
  }
  else {
    return testing
  }
}
