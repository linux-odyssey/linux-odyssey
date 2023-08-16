import { DuplicateItemError, ParentNotExistsError } from './errors.js'
import FileNode from './fileNode.js'

describe('FileNode', () => {
  let rootNode

  beforeEach(() => {
    rootNode = new FileNode({
      path: '/home/rudeus',
      name: 'rudeus',
      type: 'folder',
      discovered: true,
    })
  })

  test('should throw error when adding duplicate item', () => {
    const child = {
      path: '/home/rudeus/test',
      name: 'test',
      type: 'folder',
    }

    // Adding the child for the first time
    rootNode.addChild(child)

    expect(rootNode.children.length).toBe(1)

    // Trying to add the same child again should throw an error
    expect(() => {
      rootNode.addChild(child)
    }).toThrow(DuplicateItemError)
  })

  test('should throw error when parent does not exist', () => {
    const child = {
      path: '/home/rudeus/alphabet/test',
      name: 'test',
      type: 'folder',
    }

    // Trying to add to a nonexistent parent should throw an error
    expect(() => {
      rootNode.addChild(child)
    }).toThrow(ParentNotExistsError)
  })

  test('adds nested children to the tree', () => {
    const files = [
      {
        path: '/home/rudeus/forgotten_scroll.txt',
        name: 'forgotten_scroll.txt',
        type: 'file',
        discovered: 'test',
      },
      {
        path: '/home/rudeus/test',
        name: 'test',
        type: 'folder',
        discovered: 'test',
      },
      {
        path: '/home/rudeus/test/a',
        name: 'a',
        type: 'file',
        discovered: false,
      },
    ]

    files.forEach((file) => {
      rootNode.addChild(file)
    })

    expect(rootNode.children.length).toBe(2)
    expect(rootNode.children[1].children.length).toBe(1)
    console.log(rootNode.toString())
  })
})
