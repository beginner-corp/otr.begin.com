@app
offrecord

@domain
otr.begin.com

@aws
profile smallwins
region us-east-1

@ws
@http
get /
get /js/:file
get /login
get /:channel
post /logout

@tables
data
  scopeID *String
  dataID **String
  ttl TTL
