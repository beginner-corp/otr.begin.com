module.exports = function renderTeam(team) {
  // ensure team is a unique list
  let ids = Array.from(new Set(team.map(p=> p.account.userID)))
  let ppl = ids.map(id=> team.find(p=> p.account.userID === id)).map(p=> p.account)
  let one = p=> `<option value=/${p.teamID}-${p.userID}>${p.name}</option>`
  return `<select id=members onchange="window.location=this.value;">${ppl.map(one).join('')}</select>`
}
