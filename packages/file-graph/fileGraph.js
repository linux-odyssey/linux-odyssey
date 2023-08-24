import FileNode from './fileNode.js'

export default class FileGraph {
  constructor(root) {
    this.root = new FileNode(root)
  }

  add(file) {
    // Logic to add the file node to the graph
    // You can implement the logic to find the appropriate location in the file graph
    // If the file node already exists, throw an error

    const newNode = new FileNode(file)
    this.root.addChild(newNode, { makeParents: true })
  }

  remove(file) {
    // Logic to remove a file node from the graph
    // If the file node is a folder, also remove all children
    // If the file node doesn't exist, throw an error

    const nodeToRemove = this.findNode(file)
    if (nodeToRemove) {
      const parentNode = this.findParentNode(file)
      if (parentNode) {
        parentNode.children = parentNode.children.filter(
          (child) => child !== nodeToRemove
        )
      }
    } else {
      throw new Error(`File node not found: ${file.path}`)
    }
  }

  discover(eventFiles) {
    // Logic to handle the discover event
    // Overwrite the file graph with the provided files
    // Remove file nodes that don't exist anymore and add new ones

    const updatedNodes = eventFiles.map((file) => new FileNode(file))
    this.root = new FileNode({
      path: '/',
      type: 'folder',
      discovered: true,
      children: updatedNodes,
    })
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
