import FileNode from './fileNode.js'

export default class FileGraph extends FileNode {
  add(files) {
    // Logic to add the file node to the graph
    // You can implement the logic to find the appropriate location in the file graph
    // If the file node already exists, throw an error

    files.forEach((file) => {
      this.addChild(file, { makeParents: true })
    })
  }

  remove(files) {
    // Logic to remove a file node from the graph
    // If the file node is a folder, also remove all children
    // If the file node doesn't exist, throw an error

    files.forEach((file) => {
      this.removeChild(file)
    })
  }

  discover(eventFiles) {
    // Logic to handle the discover event
    // Overwrite the file graph with the provided files
    // Remove file nodes that don't exist anymore and add new ones

    const newNode = new FileNode(eventFiles[0])

    eventFiles.slice(1).forEach((file) => {
      newNode.addChild(file, { makeParents: true })
    })

    this.merge(newNode)
  }

  handleEvent(event) {
    // eslint-disable-next-line default-case
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
