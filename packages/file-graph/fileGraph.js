import FileNode from './fileNode.js'

export default class FileGraph extends FileNode {
  clone() {
    // Logic to clone the file graph
    // You can use the FileNode.clone() method
    return new FileGraph(this)
  }

  add(files) {
    // Logic to add the file node to the graph
    // You can implement the logic to find the appropriate location in the file graph
    // If the file node already exists, throw an error

    const result = this.clone()
    files.forEach((file) => {
      result.addChild(file, { makeParents: true })
    })
    return result
  }

  remove(files) {
    // Logic to remove a file node from the graph
    // If the file node is a folder, also remove all children
    // If the file node doesn't exist, throw an error

    const result = this.clone()
    files.forEach((file) => {
      result.removeChild(file)
    })
    return result
  }

  discover(eventFiles) {
    // Logic to handle the discover event
    // Overwrite the file graph with the provided files
    // Remove file nodes that don't exist anymore and add new ones

    const discovery = new FileNode(eventFiles[0])

    eventFiles.slice(1).forEach((file) => {
      discovery.addChild(file, { makeParents: true })
    })

    const newNode = this.clone()
    newNode.merge(discovery)
    return newNode
  }
}
