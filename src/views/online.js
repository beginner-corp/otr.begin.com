let layout = require('./_layout')

module.exports = function render({account, online}) {
  return layout({account, state: {online}})
}

/*
function r({account, state}) {
  return `<!doctype html>
<html>
<link rel=stylesheet type=text/css href=${_static('tailwind.min.css')}>
<body style=background:#edf2f7>

<div class="font-sans antialiased h-screen flex">
  
  <!-- sidebar -->
  <div class="bg-indigo-900 text-purple-100 w-3/12">
    <h1 class="font-semibold text-xl leading-tight truncate p-2 pt-4">Online</h1>
    <span class="text-indigo-300 opacity-90 text-sm pl-2">Logout <a class="pointer-events-auto" href=/logout>${account.name}</a>
    <hr class="m-2 border-indigo-600">
    <main>Loading...</main>
  </div>

  <!-- window -->
  <section class="bg-white flex-1 p-4">
    <h1>Welcome to Off the Record</h1>
    <p>Join an expiring chat with a coworker.</p>
  </section>
</div>

<script>
window.STATE = ${JSON.stringify({online}, null, 2)};
window.WS_URL = '${process.env.WSS_URL}';
</script>

<script type=module src=${_static('index.js')}></script>

</body>
</html>`
}*/
