import { describe, test, expect } from '@jest/globals'
import FileGraph from '../src/fileGraph.js'
import FileNode from '../src/fileNode.js'

describe('FileGraph', () => {
  let root: FileNode

  beforeEach(() => {
    root = new FileNode({
      path: '/',
      type: 'folder',
      discovered: true,
    })
  })

  test('add files to graph', () => {
    const fileGraph = new FileGraph(root)

    const filesToAdd = [
      {
        path: '/home/user/file1.txt',
        type: 'file',
        discovered: true,
      },
      {
        path: '/home/user/folder1',
        type: 'folder',
        discovered: true,
      },
    ]

    fileGraph.add(filesToAdd)

    expect(fileGraph.children.length).toBe(1)
    expect(fileGraph.children[0].children[0].children.length).toBe(2)
  })

  test('remove files from graph', () => {
    const fileGraph = new FileGraph(root)

    const filesToAdd = [
      {
        path: '/home/user/folder1',
        type: 'folder',
        discovered: true,
      },
      {
        path: '/home/user/folder2',
        type: 'folder',
        discovered: true,
      },
      {
        path: '/home/user/folder1/file1.txt',
        type: 'file',
        discovered: true,
      },
      {
        path: '/home/user/folder2/file2.txt',
        type: 'file',
        discovered: true,
      },
    ]

    fileGraph.add(filesToAdd)

    const filesToRemove = [
      {
        path: '/home/user/folder1/file1.txt',
        type: 'folder',
        discovered: true,
      },
      {
        path: '/home/user/folder2',
        type: 'folder',
        discovered: true,
      },
    ]

    fileGraph.remove(filesToRemove)

    expect(fileGraph.children[0].children[0].children.length).toBe(1)
    expect(fileGraph.children[0].children[0].children[0].name).toBe('folder1')
    expect(fileGraph.children[0].children[0].children[0].children.length).toBe(
      0
    )
  })

  test('discover', () => {
    const fileGraph = new FileGraph(root)
    const discoverFiles = [
      {
        path: '/home/user/folder1',
        type: 'folder',
        discovered: true,
      },
      {
        path: '/home/user/folder1/file1.txt',
        type: 'file',
        discovered: true,
      },
      {
        path: '/home/user/folder1/file2.txt',
        type: 'file',
        discovered: true,
      },
      {
        path: '/home/user/folder1/file3.txt',
        type: 'file',
        discovered: true,
      },
    ]

    fileGraph.discover(discoverFiles)
    expect(fileGraph.children[0].children[0].children[0].children.length).toBe(
      3
    )
  })

  test('discover new files', () => {
    const fileGraph = new FileGraph(root)

    const filesToAdd = [
      {
        path: '/home/user/folder1',
        type: 'folder',
        discovered: true,
      },
      {
        path: '/home/user/folder2',
        type: 'folder',
        discovered: true,
      },
      {
        path: '/home/user/folder1/file1.txt',
        type: 'file',
        discovered: true,
      },
      {
        path: '/home/user/folder2/file2.txt',
        type: 'file',
        discovered: true,
      },
    ]

    fileGraph.add(filesToAdd)

    const newFiles = [
      {
        path: '/home/user/folder1',
        type: 'folder',
        discovered: true,
      },
      {
        path: '/home/user/folder1/file1.txt',
        type: 'file',
        discovered: true,
      },
      {
        path: '/home/user/folder1/file2.txt',
        type: 'file',
        discovered: true,
      },
      {
        path: '/home/user/folder1/file3.txt',
        type: 'file',
        discovered: true,
      },
    ]

    fileGraph.discover(newFiles)

    expect(fileGraph.children[0].children[0].children.length).toBe(2)
    expect(fileGraph.children[0].children[0].children[0].children.length).toBe(
      3
    )
  })
})
