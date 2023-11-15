import DAG from './dag.js'

describe('dag', () => {
  const data = [
    {
      _id: 'helloworld',
      title: 'Hello, Linux World!',
      requirements: [],
    },
    {
      _id: 'spell',
      title: 'Learn to spell',
      requirements: ['helloworld'],
    },
    {
      _id: 'discover',
      title: 'Discover the World!',
      requirements: ['spell'],
    },
    {
      _id: 'read',
      title: 'Read the File',
      requirements: ['spell'],
    },
    {
      _id: 'remove',
      requirements: ['read', 'discover'],
    },
    {
      _id: 'move',
      requirements: ['helloworld'],
    },
    {
      _id: 'copy',
      requirements: ['remove', 'move'],
    },
  ]

  it('should set layers', () => {
    const dag = new DAG(data)
    dag.format()
    expect(dag.get('helloworld').layer).toBe(1)
    expect(dag.get('spell').layer).toBe(2)
    expect(dag.get('move').layer).toBe(2)
    expect(dag.get('read').layer).toBe(3)
    expect(dag.get('discover').layer).toBe(3)
    expect(dag.get('remove').layer).toBe(4)
    expect(dag.get('copy').layer).toBe(5)
  })
})
