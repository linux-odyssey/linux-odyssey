import { basename } from './utils.js'

export default class File {
  constructor({ path, type, discovered }) {
    this.path = path.trimEnd('/')
    this.name = basename(path)
    this.type = type
    this.discovered = discovered
  }

  isDirectory() {
    return this.type === 'folder'
  }

  contains(file) {
    if (!this.isDirectory()) return false
    if (this.path === file.path) return true
    const parentPath = this.path.endsWith('/') ? this.path : `${this.path}/`
    return file.path.startsWith(parentPath)
  }
}
