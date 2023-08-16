export default class File {
  constructor({ path, name, type, discovered }) {
    this.path = path
    this.name = name
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
