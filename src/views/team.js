module.exports = function renderTeam(userID, team) {
  // ensure team is a unique list
  let ids = Array.from(new Set(team.map(p=> p.account.userID)))
  let ppl = ids.map(id=> team.find(p=> p.account.userID === id)).map(p=> p.account)
  let selected = p=> p.userID === userID? ' selected':''
  let one = p=> `<option value=/${p.teamID}-${p.userID}${selected(p)}>${p.name}</option>`
  return `<select id=members onchange="window.location=this.value;">${ppl.map(one).join('')}</select>`
}
