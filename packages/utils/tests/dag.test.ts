import DAG from '../src/dag.js'

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
    expect(dag.getNode('helloworld').layer).toBe(1)
    expect(dag.getNode('spell').layer).toBe(2)
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
    expect(dag.getNode('helloworld').layer).toBe(1)
    expect(dag.getNode('spell').layer).toBe(2)
    expect(dag.getNode('discover').layer).toBe(2)
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
    expect(dag.getNode('A').layer).toBe(1)
    expect(dag.getNode('B').layer).toBe(1)
    expect(dag.getNode('C').layer).toBe(2)
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
    expect(dag.getNode('A').layer).toBe(1)
    expect(dag.getNode('B').layer).toBe(1)
    expect(dag.getNode('C').layer).toBe(2)
    expect(dag.getNode('D').layer).toBe(3)
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
    expect(dag.getEdges()).toEqual(new Set([['helloworld', 'spell']]))
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
    expect(dag.getEdges()).toEqual(
      new Set([
        ['helloworld', 'discover'],
        ['helloworld', 'spell'],
      ])
    )
  })
})

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
    expect(dag.getLayers()).toEqual([1, 1])
  })

  it('branch layers', () => {
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
    expect(dag.getLayers()).toEqual([1, 2])
  })
})
