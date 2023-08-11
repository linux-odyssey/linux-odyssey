const fs = require('fs').promises
const path = require('path')

async function collectFilesInfo(inputPath, level = 0) {
  const stats = await fs.stat(inputPath)
  const discovered = level === 0
  const name = path.basename(inputPath)
  const file = {
    path: inputPath,
    name,
    type: stats.isDirectory() ? 'folder' : 'file',
    discovered,
  }
  if (stats.isFile()) {
    return [file]
  }
  if (stats.isDirectory()) {
    const entries = await fs.readdir(inputPath)
    const result = await Promise.all(
      entries.map((entry) =>
        collectFilesInfo(path.join(inputPath, entry), level + 1)
      )
    )
    return [file, ...result.flat()]
  }
  return []
}

async function discoverFiles(argv) {
  const targetPath = argv._.length < 2 ? ['.'] : argv._.slice(1)
  console.log(targetPath)
  const result = await Promise.all(
    targetPath.map((p) => path.resolve(process.cwd(), p)).map(collectFilesInfo)
  )
  return { discover: result.flat() }
}

module.exports = discoverFiles
