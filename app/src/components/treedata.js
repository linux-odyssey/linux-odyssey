export default {
  name: 'root',
  type: 'folder',
  children: [
    {
      name: 'folder1',
      type: 'folder',
      children: [
        {
          name: 'file1-1',
          type: 'file',
        },
        {
          name: 'file1-2',
          type: 'file',
        },
      ],
    },
    {
      name: 'folder2',
      type: 'folder',
      children: [
        {
          name: 'file2-1',
          type: 'file',
        },
        {
          name: 'file2-2',
          type: 'file',
        },
      ],
    },
  ],
}
