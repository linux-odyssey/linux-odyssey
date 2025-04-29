import { describe, test, expect } from '@jest/globals'
import { ParentNotExistsError } from '../errors.js'
import FileNode, { IFileNode } from '../fileNode.js'
import { FileObject } from '../file.js'

function createNodeFromFiles(files: FileObject[]) {
  const node = new FileNode(files[0])
  files.slice(1).forEach((file) => node.addChild(file))
  return node
}

function mergeTest(
  files1: FileObject[],
  files2: FileObject[],
  expectedFiles: FileObject[]
) {
  const node1 = createNodeFromFiles(files1)
  const node2 = createNodeFromFiles(files2)
  const expectedNode = createNodeFromFiles(expectedFiles)

  node1.merge(node2)

  expect(node1.toString()).toBe(expectedNode.toString())
}

function removeChildTest(
  files: FileObject[],
  fileToRemove: FileObject,
  expectedFiles: FileObject[]
) {
  const node = createNodeFromFiles(files)
  const expectedNode = createNodeFromFiles(expectedFiles)

  node.removeChild(fileToRemove)

  expect(node.toString()).toBe(expectedNode.toString())
}

describe('FileNode', () => {
  let rootNode: FileNode

  beforeEach(() => {
    rootNode = new FileNode({
      path: '/home/rudeus',
      type: 'directory',
      discovered: true,
    })
  })

  test('should override discovered when adding duplicate item', () => {
    const child: FileObject = {
      path: '/home/rudeus/test',
      type: 'directory',
      discovered: false,
    }

    // Adding the child for the first time
    rootNode.addChild(child)

    expect(rootNode.children.length).toBe(1)

    // Trying to add the same child again should throw an error
    child.discovered = true
    rootNode.addChild(child)

    expect(rootNode.children[0].discovered).toBe(true)
  })

  test('should throw error when parent does not exist', () => {
    const child: FileObject = {
      path: '/home/rudeus/alphabet/test',
      type: 'directory',
      discovered: true,
    }

    // Trying to add to a nonexistent parent should throw an error
    expect(() => {
      rootNode.addChild(child)
    }).toThrow(ParentNotExistsError)
  })

  test('adds nested children to the tree', () => {
    const files: FileObject[] = [
      {
        path: '/home/rudeus/forgotten_scroll.txt',
        type: 'file',
        discovered: true,
      },
      {
        path: '/home/rudeus/test',
        type: 'directory',
        discovered: true,
      },
      {
        path: '/home/rudeus/test/a',
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
    const file: FileObject = {
      path: '/home/rudeus/test/a/b/c/d/e',
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
    const root: FileObject = {
      path: '/',
      type: 'directory',
      discovered: true,
    }
    const files1: FileObject[] = [
      root,
      { path: '/a', type: 'file' as const, discovered: true },
      { path: '/b', type: 'directory' as const, discovered: true },
      { path: '/b/c', type: 'directory' as const, discovered: true },
      { path: '/b/d', type: 'file' as const, discovered: true },
      { path: '/b/c/f', type: 'file' as const, discovered: true },
    ]

    const files2: FileObject[] = [
      { path: '/b', type: 'directory' as const, discovered: true },
      { path: '/b/c', type: 'directory' as const, discovered: true },
      { path: '/b/e', type: 'file' as const, discovered: true },
      { path: '/b/c/g', type: 'file' as const, discovered: true },
    ]

    const expected: FileObject[] = [
      root,
      { path: '/a', type: 'file' as const, discovered: true },
      { path: '/b', type: 'directory' as const, discovered: true },
      { path: '/b/c', type: 'directory' as const, discovered: true },
      { path: '/b/e', type: 'file' as const, discovered: true },
      { path: '/b/c/g', type: 'file' as const, discovered: true },
    ]

    mergeTest(files1, files2, expected)
  })

  test('merge-middle-level', () => {
    // Test if the node to merge is only the middle part of the tree
    // (i.e. the node to merge doesn't contains all level of children)
    // The original tree should keep the children that are not in the node to merge
    const root: FileObject = {
      path: '/',
      type: 'directory',
      discovered: true,
    }
    const files1: FileObject[] = [
      root,
      { path: '/a', type: 'file' as const, discovered: true },
      { path: '/b', type: 'directory' as const, discovered: true },
      { path: '/b/c', type: 'directory' as const, discovered: true },
      { path: '/b/d', type: 'file' as const, discovered: true },
      { path: '/b/c/f', type: 'file' as const, discovered: true },
    ]

    const files2: FileObject[] = [
      { path: '/b', type: 'directory' as const, discovered: true },
      { path: '/b/c', type: 'directory' as const, discovered: true },
      { path: '/b/e', type: 'file' as const, discovered: true },
    ]

    const expected: FileObject[] = [
      root,
      { path: '/a', type: 'file' as const, discovered: true },
      { path: '/b', type: 'directory' as const, discovered: true },
      { path: '/b/c', type: 'directory' as const, discovered: true },
      { path: '/b/e', type: 'file' as const, discovered: true },
      { path: '/b/c/f', type: 'file' as const, discovered: true },
    ]

    mergeTest(files1, files2, expected)
  })

  test('merge-hidden', () => {
    const root: FileObject = {
      path: '/',
      type: 'directory',
      discovered: true,
    }
    const files1: FileObject[] = [
      root,
      { path: '/a', type: 'file' as const, discovered: true },
      { path: '/.b', type: 'file' as const, discovered: false },
      { path: '/c', type: 'directory' as const, discovered: true },
      { path: '/c/.d', type: 'file' as const, discovered: false },
    ]

    const files2: FileObject[] = [
      { path: '/c', type: 'directory' as const, discovered: true },
      { path: '/c/.d', type: 'file' as const, discovered: true },
    ]

    const expected: FileObject[] = [
      root,
      { path: '/a', type: 'file' as const, discovered: true },
      { path: '/.b', type: 'file' as const, discovered: false },
      { path: '/c', type: 'directory' as const, discovered: true },
      { path: '/c/.d', type: 'file' as const, discovered: true },
    ]

    mergeTest(files1, files2, expected)
  })

  test('remove-child', () => {
    const root: FileObject = {
      path: '/',
      type: 'directory',
      discovered: true,
    }
    const files: FileObject[] = [
      root,
      { path: '/a', type: 'file' as const, discovered: true },
      { path: '/b', type: 'directory' as const, discovered: true },
      { path: '/b/c', type: 'directory' as const, discovered: true },
      { path: '/b/d', type: 'file' as const, discovered: true },
      { path: '/b/c/f', type: 'file' as const, discovered: true },
    ]

    const fileToRemove: FileObject = {
      path: '/b/c',
      type: 'directory',
      discovered: true,
    }

    const expected: FileObject[] = [
      root,
      { path: '/a', type: 'file' as const, discovered: true },
      { path: '/b', type: 'directory' as const, discovered: true },
      { path: '/b/d', type: 'file' as const, discovered: true },
    ]

    removeChildTest(files, fileToRemove, expected)
  })
})

test('load nested fileNode', () => {
  const data: IFileNode = {
    path: '/',
    type: 'directory',
    discovered: true,
    children: [
      {
        path: '/a',
        type: 'file',
        discovered: true,
      },
      {
        path: '/b',
        type: 'directory',
        discovered: true,
        children: [
          {
            path: '/b/c',
            type: 'directory',
            discovered: true,
            children: [
              {
                path: '/b/c/d',
                type: 'file',
                discovered: true,
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
