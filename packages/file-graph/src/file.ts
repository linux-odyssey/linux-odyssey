/* eslint-disable lines-between-class-members */
import { basename } from './utils.js'

interface FileObject {
  path: string
  type: string
  discovered: boolean
}

export default class File implements FileObject {
  path: string
  name: string
  type: string
  discovered: boolean

  constructor(obj: FileObject) {
    this.path = obj.path.trimEnd()
    this.name = basename(obj.path)
    this.type = obj.type
    this.discovered = obj.discovered
  }

  isDirectory() {
    return this.type === 'folder'
  }

  contains(file: FileObject) {
    if (!this.isDirectory()) return false
    if (this.path === file.path) return true
    const parentPath = this.path.endsWith('/') ? this.path : `${this.path}/`
    return file.path.startsWith(parentPath)
  }
}
