import File, { FileObject } from './file.js'
import {
  DuplicateItemError,
  ParentNotExistsError,
  FileNotExistsError,
} from './errors.js'
import { dirname } from './utils.js'

export interface IFileNode {
  path: string
  type: 'file' | 'directory'
  discovered: boolean
  children?: IFileNode[]
}

export default class FileNode extends File implements IFileNode {
  children: FileNode[]

  constructor(file: FileObject | IFileNode) {
    super(file)
    this.children = []
    if ((<FileNode>file).children)
      this.children = (<FileNode>file).children.map((f) => new FileNode(f))
  }

  addChild(
    fileInput: FileObject,
    { makeParents }: { makeParents?: boolean } = {}
  ) {
    const file = new FileNode(fileInput)
    if (file.path === this.path) {
      throw new DuplicateItemError(
        `File ${file.path} already exists in the tree: ${this.toString()}`
      )
    }

    if (this.children.some((child) => child.path === file.path)) {
      throw new DuplicateItemError(
        `File ${file.path} already exists in the tree: ${this.toString()}`
      )
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
          type: 'directory',
          discovered: false,
          children: [file],
        })
        this.addChild(parent, { makeParents })
      } else {
        throw new ParentNotExistsError(
          `Parent path not found in the tree, ${file.path}, ${this.path}`
        )
      }
    }
  }

  removeChild(fileToRemove: FileObject) {
    const file = new FileNode(fileToRemove)
    const parentPath = dirname(file.path)

    if (parentPath === this.path) {
      // Direct child of this node
      this.children = this.children.filter((child) => child.path !== file.path)
    } else {
      // Recursively call removeChild on the correct child node
      const childNode = this.children.find((child) => child.contains(file))
      if (childNode) {
        childNode.removeChild(file)
      } else {
        throw new FileNotExistsError(
          `File ${file.path} does not exist in the tree: ${this.toString()}`
        )
      }
    }
  }

  merge(fileNode: FileNode) {
    // Merge the children of the provided file node into this node
    // If a child already exists, merge the children of that child
    // If a child does not exist, add it to this node

    // If this is the same node, merge the children
    if (fileNode.path === this.path) {
      // Update the state of this node
      this.discovered = this.discovered || fileNode.discovered

      fileNode.children.forEach((child) => {
        const existingChild = this.children.find((c) => c.path === child.path)
        if (existingChild) {
          existingChild.merge(child)
        } else {
          this.children.push(new FileNode(child))
        }
      })

      // If a child exists in this node but not in the provided node, remove it
      if (fileNode.children.length > 0) {
        this.children = this.children.filter((child) =>
          fileNode.children.some((c) => c.path === child.path)
        )
      }
    }
    // If this contains the parent node
    else if (this.contains(fileNode)) {
      const childNode = this.children.find((child) => child.contains(fileNode))
      // If a child node exists, merge the provided node into the child node
      if (childNode) {
        childNode.merge(fileNode)
      }
      // If a child node does not exist, add the provided node as a child
      else {
        this.addChild(fileNode, { makeParents: true })
      }
    } else {
      throw new Error(
        `Cannot merge file nodes with different paths: ${this.path}, ${fileNode.path}`
      )
    }
  }

  toString(level = 0): string {
    let { name } = this
    const indent = '    '.repeat(level)
    name = `${indent}${name}`
    if (this.isDirectory()) name += '/'
    if (!this.discovered) name += `*`
    const childrenString = this.children
      .map((child) => child.toString(level + 1))
      .join('')
    return `${name}\n${childrenString}`
  }
}
