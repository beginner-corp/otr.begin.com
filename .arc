@app
wsapp

@cdn
# otr-staging.begin.com

@ws
# otr-wss-staging.begin.com

@static
fingerprint true

@http
get /
get /chat/:userID
get /login
get /logout

@events
online

@tables
data
  scopeID *String
  dataID **String
  ttl TTL

@aws
region us-west-2
bucket begin-west-2 
