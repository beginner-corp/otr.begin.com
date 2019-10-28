let arc = require('@architect/functions')
let data = require('@begin/data')

module.exports = async function update(message) {

  let {sender, reciever} = message
  let connections = await data.get({table: 'connections'})
  let team = connections.filter(c=> c.userID === sender || c.userID === reciever)

  return Promise.all(team.map(function(connection) {

    console.log('sending msg', JSON.stringify({connection, message}, null, 2))

    return arc.ws.send({id: connection.key, payload: message}).catch(function swallow(err) {
      // unfortunately we can't just cleanup here becuase we might have a connect that isn't registering yet
      if (err.code === 'GoneException') {
        console.log('GONE??!!!')
      }
      console.log(err)
      return
    })
  }))
}
