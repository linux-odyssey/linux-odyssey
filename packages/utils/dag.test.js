import DAG from './dag.js'

describe('dag layers', () => {
  it('two layer', () => {
    const data = [
      {
        _id: 'helloworld',
        requirements: [],
      },
      {
        _id: 'spell',
        requirements: ['helloworld'],
      },
    ]
    const dag = new DAG(data)
    expect(dag.get('helloworld').layer).toBe(1)
    expect(dag.get('spell').layer).toBe(2)
  })
  it('branch', () => {
    const data = [
      {
        _id: 'helloworld',
        requirements: [],
      },
      {
        _id: 'spell',
        requirements: ['helloworld'],
      },
      {
        _id: 'discover',
        requirements: ['helloworld'],
      },
    ]
    const dag = new DAG(data)
    expect(dag.get('helloworld').layer).toBe(1)
    expect(dag.get('spell').layer).toBe(2)
    expect(dag.get('discover').layer).toBe(2)
  })
  it('merge', () => {
    const data = [
      {
        _id: 'A',
        requirements: [],
      },
      {
        _id: 'B',
        requirements: [],
      },
      {
        _id: 'C',
        requirements: ['A', 'B'],
      },
    ]
    const dag = new DAG(data)
    expect(dag.get('A').layer).toBe(1)
    expect(dag.get('B').layer).toBe(1)
    expect(dag.get('C').layer).toBe(2)
  })
  it('skip', () => {
    const data = [
      {
        _id: 'A',
        requirements: [],
      },
      {
        _id: 'B',
        requirements: [],
      },
      {
        _id: 'C',
        requirements: ['A'],
      },
      {
        _id: 'D',
        requirements: ['B', 'C'],
      },
    ]
    const dag = new DAG(data)
    expect(dag.get('A').layer).toBe(1)
    expect(dag.get('B').layer).toBe(1)
    expect(dag.get('C').layer).toBe(2)
    expect(dag.get('D').layer).toBe(3)
  })
})

describe('dag edges', () => {
  it('one edge', () => {
    const data = [
      {
        _id: 'helloworld',
        requirements: [],
      },
      {
        _id: 'spell',
        requirements: ['helloworld'],
      },
    ]

    const dag = new DAG(data)
    expect(dag.edges).toEqual(new Set([['helloworld', 'spell']]))
  })

  it('branch edges', () => {
    const data = [
      {
        _id: 'helloworld',
        requirements: [],
      },
      {
        _id: 'spell',
        requirements: ['helloworld'],
      },
      {
        _id: 'discover',
        requirements: ['helloworld'],
      },
    ]

    const dag = new DAG(data)
    expect(dag.edges).toEqual(
      new Set([
        ['helloworld', 'discover'],
        ['helloworld', 'spell'],
      ])
    )
  })
})
