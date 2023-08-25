import FileNode from './fileNode.js'
import { FileNotExistsError } from './errors.js'

export default class FileGraph {
  constructor(root) {
    this.root = new FileNode(root)
  }

  add(files) {
    // Logic to add the file node to the graph
    // You can implement the logic to find the appropriate location in the file graph
    // If the file node already exists, throw an error

    files.forEach((file) => {
      this.root.addChild(file, { makeParents: true })
    })
  }

  remove(files) {
    // Logic to remove a file node from the graph
    // If the file node is a folder, also remove all children
    // If the file node doesn't exist, throw an error

    files.forEach((file) => {
      const pathFolders = file.path
        .split('/')
        .filter((folder) => folder.length > 0)
      const fileName = pathFolders.pop()
      let currentNode = this.root

      for (const folder of pathFolders) {
        currentNode = currentNode.children.find(
          (child) => child.name === folder
        )
        if (!currentNode) {
          throw new FileNotExistsError(
            `File not found: ${fileToFind.path}, ${this.toString()}`
          )
        }
      }

      if (!currentNode.children.some((child) => child.name === fileName)) {
        throw new FileNotExistsError(
          `File not found: ${file.path}, ${this.toString()}`
        )
      } else {
        currentNode.children = currentNode.children.filter(
          (child) => child.name !== fileName
        )
      }
    })
  }

  discover(eventFiles) {
    // Logic to handle the discover event
    // Overwrite the file graph with the provided files
    // Remove file nodes that don't exist anymore and add new ones

    const newRoot = new FileNode({
      path: '/',
      type: 'folder',
      discovered: true,
    })

    eventFiles.forEach((file) => {
      newRoot.addChild(file, { makeParents: true })
    })

    this.root = newRoot
  }

  handleEvent(event) {
    switch (true) {
      case !!event.add:
        this.add(event.add)
        break
      case !!event.remove:
        this.remove(event.remove)
        break
      case !!event.discover:
        this.discover(event.discover)
        break
      // Implement other cases if needed
    }
  }
}
