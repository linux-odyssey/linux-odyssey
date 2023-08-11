const fs = require('fs').promises
const path = require('path')

async function collectFilesInfo(directoryPath, level = 0) {
  const entries = await fs.readdir(directoryPath, { withFileTypes: true })

  const promises = entries.map(async (entry) => {
    const filePath = path.join(directoryPath, entry.name)
    const isDirectory = entry.isDirectory()
    const discovered = level === 0 && !entry.name.startsWith('.')

    const file = {
      path: filePath,
      name: entry.name,
      type: isDirectory ? 'folder' : 'file',
      discovered,
    }

    if (isDirectory && level < 2) {
      // Get up to two levels deep
      const subFilesInfo = await collectFilesInfo(filePath, level + 1)
      return [file, ...subFilesInfo]
    }

    return file
  })

  const results = await Promise.all(promises)
  return results.flat()
}

async function discoverFiles(name, args) {
  let targetPath = args[0] || '.'
  targetPath = path.resolve(process.cwd(), targetPath)
  return { discover: await collectFilesInfo(targetPath) }
}

module.exports = discoverFiles
