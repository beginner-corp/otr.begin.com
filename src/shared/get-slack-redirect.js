module.exports = function getRedirect() {
  if (process.env.NODE_ENV === 'testing') {
    return 'http://localhost:3333/login'
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
