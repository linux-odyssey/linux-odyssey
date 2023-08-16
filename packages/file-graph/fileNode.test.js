import FileNode from './fileNode.js'

test('addChild method adds a child node to the tree', () => {
  const files = [
    {
      path: '/home/rudeus',
      name: 'rudeus',
      type: 'folder',
      discovered: 'test',
    },
    {
      path: '/home/rudeus/.bash_history',
      name: '.bash_history',
      type: 'file',
      discovered: 'test',
    },
    {
      path: '/home/rudeus/.viminfo',
      name: '.viminfo',
      type: 'file',
      discovered: 'test',
    },
    {
      path: '/home/rudeus/.zshrc',
      name: '.zshrc',
      type: 'file',
      discovered: 'test',
    },
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
      path: '/home/rudeus/test/.b',
      name: '.b',
      type: 'file',
      discovered: false,
    },
    {
      path: '/home/rudeus/test/a',
      name: 'a',
      type: 'file',
      discovered: false,
    },
  ]

  const root = new FileNode(files[0])

  files.slice(1).forEach((file) => {
    root.addChild(file)
  })

  console.log(root.toString())

  expect(root.children.length).toBe(5)
})
