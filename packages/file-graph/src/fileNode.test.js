import { DuplicateItemError, ParentNotExistsError } from './errors.js'
import FileNode from './fileNode.js'

function createNodeFromFiles(files) {
  const node = new FileNode(files[0])
  files.slice(1).forEach((file) => node.addChild(file))
  return node
}

function mergeTest(files1, files2, expectedFiles) {
  const node1 = createNodeFromFiles(files1)
  const node2 = createNodeFromFiles(files2)
  const expectedNode = createNodeFromFiles(expectedFiles)

  node1.merge(node2)

  expect(node1.toString()).toBe(expectedNode.toString())
}

function removeChildTest(files, fileToRemove, expectedFiles) {
  const node = createNodeFromFiles(files)
  const expectedNode = createNodeFromFiles(expectedFiles)

  node.removeChild(fileToRemove)

  expect(node.toString()).toBe(expectedNode.toString())
}

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
  })

  test('adds nested children to the tree with makeParents option', () => {
    const file = {
      path: '/home/rudeus/test/a/b/c/d/e',
      name: 'a',
      type: 'file',
      discovered: false,
    }

    rootNode.addChild(file, { makeParents: true })

    let currentNode = rootNode
    for (let i = 0; i < 5; i += 1) {
      expect(currentNode.children.length).toBe(1)
      // eslint-disable-next-line prefer-destructuring
      currentNode = currentNode.children[0]
    }
  })

  test('merge-subtree', () => {
    const root = {
      path: '/',
      type: 'folder',
    }
    const files1 = [
      root,
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
      root,
      { path: '/a', type: 'file' },
      { path: '/b', type: 'folder' },
      { path: '/b/c', type: 'folder' },
      { path: '/b/e', type: 'file' },
      { path: '/b/c/g', type: 'file' },
    ]

    mergeTest(files1, files2, expected)
  })

  test('merge-middle-level', () => {
    // Test if the node to merge is only the middle part of the tree
    // (i.e. the node to merge doesn't contains all level of children)
    // The original tree should keep the children that are not in the node to merge
    const root = {
      path: '/',
      type: 'folder',
    }
    const files1 = [
      root,
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
    ]

    const expected = [
      root,
      { path: '/a', type: 'file' },
      { path: '/b', type: 'folder' },
      { path: '/b/c', type: 'folder' },
      { path: '/b/e', type: 'file' },
      { path: '/b/c/f', type: 'file' },
    ]

    mergeTest(files1, files2, expected)
  })

  test('merge-hidden', () => {
    const root = {
      path: '/',
      type: 'folder',
    }
    const files1 = [
      root,
      { path: '/a', type: 'file', discovered: true },
      { path: '/.b', type: 'file', discovered: false },
      { path: '/c', type: 'folder', discovered: true },
      { path: '/c/.d', type: 'file', discovered: false },
    ]

    const files2 = [
      { path: '/c', type: 'folder', discovered: true },
      { path: '/c/.d', type: 'file', discovered: true },
    ]

    const expected = [
      root,
      { path: '/a', type: 'file', discovered: true },
      { path: '/.b', type: 'file', discovered: false },
      { path: '/c', type: 'folder', discovered: true },
      { path: '/c/.d', type: 'file', discovered: true },
    ]

    mergeTest(files1, files2, expected)
  })

  test('remove-child', () => {
    const root = {
      path: '/',
      type: 'folder',
    }
    const files = [
      root,
      { path: '/a', type: 'file' },
      { path: '/b', type: 'folder' },
      { path: '/b/c', type: 'folder' },
      { path: '/b/d', type: 'file' },
      { path: '/b/c/f', type: 'file' },
    ]

    const fileToRemove = { path: '/b/c', type: 'folder' }

    const expected = [
      root,
      { path: '/a', type: 'file' },
      { path: '/b', type: 'folder' },
      { path: '/b/d', type: 'file' },
    ]

    removeChildTest(files, fileToRemove, expected)
  })
})

test('load nested fileNode', () => {
  const data = {
    path: '/',
    type: 'folder',
    children: [
      {
        path: '/a',
        type: 'file',
      },
      {
        path: '/b',
        type: 'folder',
        children: [
          {
            path: '/b/c',
            type: 'folder',
            children: [
              {
                path: '/b/c/d',
                type: 'file',
              },
            ],
          },
        ],
      },
    ],
  }

  const node = new FileNode(data)

  expect(node.children.length).toBe(2)
  expect(node.children[1].children.length).toBe(1)
  expect(node.children[1].children[0].children.length).toBe(1)
})
