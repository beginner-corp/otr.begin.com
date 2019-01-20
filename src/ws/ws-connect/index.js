let staging = 'https://otr-staging.begin.com'
let production = 'https://otr.begin.com'

/**
 * enforce same-origin
 */
exports.handler = async function ws(event) {
  let env = process.env.NODE_ENV
  if (env === 'testing') {
    return {statusCode: 200}
  }
  else if (env === 'staging' && event.headers.Origin === staging) {
    return {statusCode: 200}
  }
  else if (env === 'production' && event.headers.Origin === production) {
    return {statusCode: 200}
  }
  else {
    return {statusCode: 500}
  }
}
