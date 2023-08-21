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

  test('adds nested children to the tree with makeParents option', () => {
    const file = {
      path: '/home/rudeus/test/a/b/c/d/e',
      name: 'a',
      type: 'file',
      discovered: false,
    }

    rootNode.addChild(file, { makeParents: true })

    console.log(rootNode.toString())
    let currentNode = rootNode
    for (let i = 0; i < 5; i += 1) {
      expect(currentNode.children.length).toBe(1)
      // eslint-disable-next-line prefer-destructuring
      currentNode = currentNode.children[0]
    }
  })

  test('merge-two-trees', () => {
    const root = {
      path: '/',
      type: 'folder',
    }
    const files1 = [
      { path: '/a', type: 'file' },
      { path: '/b', type: 'folder' },
      { path: '/b/c', type: 'folder' },
      { path: '/b/d', type: 'file' },
      { path: '/b/c/f', type: 'file' },
    ]

    const files2 = [
      { path: '/b', type: 'folder' },
      { path: '/b/c', type: 'folder' },
      { path: '/b/e', type: 'file' },
      { path: '/b/c/g', type: 'file' },
    ]

    const expected = [
      { path: '/a', type: 'file' },
      { path: '/b', type: 'folder' },
      { path: '/b/c', type: 'folder' },
      { path: '/b/e', type: 'file' },
      { path: '/b/c/g', type: 'file' },
    ]

    const node1 = new FileNode(root)
    files1.forEach((file) => node1.addChild(file))

    const node2 = new FileNode(files2[0])
    files2.slice(1).forEach((file) => node2.addChild(file))

    console.log('node1', node1.toString())
    console.log('node2', node2.toString())

    const expectedNode = new FileNode(root)
    expected.forEach((file) => expectedNode.addChild(file))

    console.log('expected', expectedNode.toString())

    node1.merge(node2)

    console.log('node1-after', node1.toString())

    expect(node1.toString()).toBe(expectedNode.toString())
  })
})
