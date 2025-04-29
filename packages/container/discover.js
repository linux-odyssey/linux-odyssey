const fs = require('fs').promises
const path = require('path')
const { resolvePath } = require('./utils')

async function collectFilesInfo(inputPath, level = 0, hiddenFiles = false) {
  const stats = await fs.stat(inputPath)
  const name = path.basename(inputPath)
  const discovered = level <= 1 && (hiddenFiles || !name.startsWith('.'))
  const files = [
    {
      path: inputPath,
      name,
      type: stats.isDirectory() ? 'directory' : 'file',
      discovered,
    },
  ]
  if (stats.isDirectory() && level < 2) {
    try {
      let entries = await fs.readdir(inputPath)
      if (level > 0) {
        entries = entries.slice(0, 5)
      }
      const result = await Promise.all(
        entries.map((entry) =>
          collectFilesInfo(path.join(inputPath, entry), level + 1, hiddenFiles)
        )
      )
      files.push(...result.flat())
    } catch (_) {
      // ignore
    }
  }
  return files
}

async function discoverFiles(argv) {
  const targetPath = argv._.length < 2 ? ['.'] : argv._.slice(1)
  try {
    const result = await Promise.all(
      targetPath
        .map((p) => resolvePath(p))
        .map((p) => collectFilesInfo(p, 0, argv.a || argv.all))
    )
    return { discover: result.flat() }
  } catch (_) {
    return {}
  }
}

module.exports = {
  discoverFiles,
  collectFilesInfo,
}
