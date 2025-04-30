import { FileObject } from './file.js'
import FileNode from './fileNode.js'

export interface FileGraphUpdateEvent {
  add?: FileObject[]
  remove?: FileObject[]
  discover?: FileObject[]
  pwd?: string
}

export default class FileGraph extends FileNode {
  add(files: FileObject[]) {
    // Logic to add the file node to the graph
    // You can implement the logic to find the appropriate location in the file graph
    // If the file node already exists, throw an error

    files.forEach((file) => {
      this.addChild(file, { makeParents: true })
    })
  }

  remove(files: FileObject[]) {
    // Logic to remove a file node from the graph
    // If the file node is a directory, also remove all children
    // If the file node doesn't exist, throw an error

    files.forEach((file) => {
      this.removeChild(file)
    })
  }

  discover(eventFiles: FileObject[]) {
    // Logic to handle the discover event
    // Overwrite the file graph with the provided files
    // Remove file nodes that don't exist anymore and add new ones

    if (eventFiles.length === 0) {
      return
    }

    const newNode = new FileNode(eventFiles[0])

    eventFiles.slice(1).forEach((file) => {
      newNode.addChild(file, { makeParents: true })
    })

    this.merge(newNode)
  }

  handleEvent(event: FileGraphUpdateEvent) {
    // eslint-disable-next-line default-case
    if (event.add) {
      this.add(event.add)
    }
    if (event.remove) {
      this.remove(event.remove)
    }
    if (event.discover) {
      this.discover(event.discover)
    }
  }
}
