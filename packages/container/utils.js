const os = require('os')
const path = require('path')

function resolvePath(p) {
  return path.resolve(process.cwd(), p.replace('~', os.homedir()))
}

module.exports = {
  resolvePath,
}
