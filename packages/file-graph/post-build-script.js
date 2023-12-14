import fs from 'fs'
import path from 'path'

function addJsExtension(filePath) {
  if (fs.statSync(filePath).isDirectory()) {
    for (const child of fs.readdirSync(filePath)) {
      addJsExtension(path.join(filePath, child))
    }
  } else if (filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8')
    content = content.replace(/from\s+["']([^"']+)["']/g, (match, group1) => {
      if (!group1.match(/^[./]|http|https/)) return match // Skip node_modules
      if (!group1.endsWith('.js')) return `from "${group1}.js"`
      return match
    })
    fs.writeFileSync(filePath, content, 'utf8')
  }
}

addJsExtension('./dist')
