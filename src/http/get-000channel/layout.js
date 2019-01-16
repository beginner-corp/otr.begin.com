module.exports = function layout(body) {
  return `<!doctype html>
<html>
<head>
  <title>🤫 Off Record</title>
  <link href="data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQEAYAAABPYyMiAAAABmJLR0T///////8JWPfcAAAACXBIWXMAAABIAAAASABGyWs+AAAAF0lEQVRIx2NgGAWjYBSMglEwCkbBSAcACBAAAeaR9cIAAAAASUVORK5CYII=" rel="icon" type="image/x-icon" />
</head>
<body>
${body}
<script type=module src=/js/index.mjs></script>
</body>
</html>`
}
