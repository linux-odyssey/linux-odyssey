const fs = require('fs').promises
const path = require('path')
const { resolvePath } = require('./utils')

async function collectFilesInfo(inputPath, level = 0, hiddenFiles = false) {
  let stats
  try {
    stats = await fs.stat(inputPath)
  } catch (e) {
    if (e.code === 'ENOENT') {
      return []
    }
    throw e
  }
  const name = path.basename(inputPath)
  const discovered = level <= 1 && (hiddenFiles || !name.startsWith('.'))
  const self = {
    path: inputPath,
    name,
    type: stats.isDirectory() ? 'directory' : 'file',
    discovered,
  }
  const files = [self]
  if (stats.isDirectory() && level < 2) {
    try {
      let entries = await fs.readdir(inputPath)
      if (entries.length === 0) {
        self.empty = true
        return files
      }
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
    const result = (
      await Promise.all(
        targetPath
          .map((p) => resolvePath(p))
          .map((p) => collectFilesInfo(p, 0, argv.a || argv.all))
      )
    ).flat()
    if (result.length === 0) {
      return {}
    }
    return { discover: result }
  } catch (_) {
    return {}
  }
}

module.exports = {
  discoverFiles,
  collectFilesInfo,
}
