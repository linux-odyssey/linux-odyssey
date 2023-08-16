import path from 'path'
import File from './file.js'
import { DuplicateItemError, ParentNotExistsError } from './errors.js'

export default class FileNode extends File {
  constructor(file) {
    super(file)
    this.children = []
  }

  addChild(fileInput) {
    const file = new File(fileInput)
    if (file.path === this.path) {
      throw new DuplicateItemError('File already exists in the tree')
    }

    if (this.children.some((child) => child.path === file.path)) {
      throw new DuplicateItemError('File already exists in the tree')
    }

    const parentPath = path.dirname(file.path)
    if (parentPath === this.path) {
      // Direct child of this node
      this.children.push(new FileNode(file))
    } else {
      // Recursively call addChild on the correct child node
      const childNode = this.children.find((child) => child.contains(file))
      if (childNode) {
        childNode.addChild(file)
      } else {
        throw new ParentNotExistsError('Parent path not found in the tree')
      }
    }
  }

  toString() {
    const indent = '    '.repeat(this.path.split('/').length - 1)
    const suffix = this.isDirectory() ? '/' : ''
    const childrenString = this.children
      .map((child) => child.toString())
      .join('')
    return `${indent}${this.name}${suffix}\n${childrenString}`
  }
}
