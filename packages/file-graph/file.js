import { basename } from './utils.js'

export default class File {
  constructor({ path, type, discovered }) {
    this.path = path
    this.name = basename(path)
    this.type = type
    this.discovered = discovered
  }

  isDirectory() {
    return this.type === 'folder'
  }

  contains(file) {
    return this.isDirectory() && file.path.startsWith(this.path)
  }
}
