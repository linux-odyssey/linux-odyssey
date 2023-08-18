import File from './file.js'
import { DuplicateItemError, ParentNotExistsError } from './errors.js'
import { basename, dirname } from './utils.js'

export default class FileNode extends File {
  constructor(file) {
    super(file)
    this.children = file.children || []
  }

  addChild(fileInput, { makeParents } = {}) {
    const file = new FileNode(fileInput)
    if (file.path === this.path) {
      throw new DuplicateItemError('File already exists in the tree')
    }

    if (this.children.some((child) => child.path === file.path)) {
      throw new DuplicateItemError('File already exists in the tree')
    }

    const parentPath = dirname(file.path)
    if (parentPath === this.path) {
      // Direct child of this node
      this.children.push(file)
    } else {
      // Recursively call addChild on the correct child node
      const childNode = this.children.find((child) => child.contains(file))
      if (childNode) {
        childNode.addChild(file)
      } else if (makeParents) {
        const parent = new FileNode({
          path: parentPath,
          name: basename(parentPath),
          type: 'folder',
          discovered: false,
          children: [file],
        })
        this.addChild(parent, { makeParents })
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
