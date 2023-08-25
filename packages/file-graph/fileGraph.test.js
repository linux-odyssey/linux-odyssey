import FileGraph from './fileGraph.js'
import FileNode from './fileNode.js'

describe('FileGraph', () => {
  let root

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

    console.log(fileGraph.root.toString())
    expect(fileGraph.root.children.length).toBe(1)
    expect(fileGraph.root.children[0].children[0].children.length).toBe(2)
  })

  test('remove files from graph', () => {
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

    const filesToRemove = [
      {
        path: '/home/user/folder1',
        type: 'folder',
      },
    ]

    fileGraph.remove(filesToRemove)

    console.log(fileGraph.root.toString())
    expect(fileGraph.root.children[0].children[0].children.length).toBe(1)
  })

  test('discover new files', () => {
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
    expect(fileGraph.root.children[0].children[0].children.length).toBe(2)

    const newFiles = [
      {
        path: '/home/newfile.txt',
        type: 'file',
        discovered: true,
      },
      {
        path: '/home/user/file1.txt',
        type: 'file',
        discovered: true,
      },
    ]

    fileGraph.discover(newFiles)

    console.log(fileGraph.root.toString())
    expect(fileGraph.root.children[0].children.length).toBe(2)
    expect(fileGraph.root.children[0].children[0].name).toBe('newfile.txt')
    expect(fileGraph.root.children[0].children[0].children[0].name).toBe(
      'file1.txt'
    )
  })
})
