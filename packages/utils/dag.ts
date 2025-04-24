export interface NodeInput {
  id: string
  requirements: string[]
}

type Node<T extends NodeInput> = T & {
  layer: number
  index: number
}

export default class DAG<T extends NodeInput> {
  private nodes = new Map<string, Node<T>>()
  private edges = new Set<[string, string]>()
  private layers: number[] = []

  constructor(nodes: T[]) {
    this.nodes = new Map(
      nodes.map((node) => [node.id, { ...node, layer: 0, index: 0 }])
    )
    this.edges = new Set<[string, string]>()
    for (const id of this.nodes.keys()) {
      this.setLayer(id)
      this.addEdges(id)
    }
  }

  getNode(id: string) {
    return this.nodes.get(id)
  }

  getNodes() {
    return Array.from(this.nodes.values())
  }

  getEdges() {
    return this.edges
  }

  getEdgesArray() {
    return Array.from(this.edges.values())
  }

  getLayers() {
    return this.layers
  }

  getLayer(id: string) {
    const node = this.nodes.get(id)
    if (!node) {
      throw new Error(`Node ${id} not found`)
    }
    return this.layers[node.layer - 1] || 0
  }

  private setLayer(id: string) {
    const node = this.nodes.get(id)
    if (!node) {
      throw new Error(`Node ${id} not found`)
    }
    if (node.layer !== 0) {
      return node.layer
    }
    const previousLayer = node.requirements.map((rId: string) =>
      this.setLayer(rId)
    )
    node.layer = Math.max(...previousLayer, 0) + 1
    if (this.layers.length < node.layer) {
      this.layers.push(1)
    } else {
      this.layers[node.layer - 1] += 1
    }
    node.index = this.layers[node.layer - 1]
    return node.layer
  }

  addEdges(id: string) {
    const node = this.nodes.get(id)
    if (!node) {
      throw new Error(`Node ${id} not found`)
    }
    node.requirements.forEach((rId: string) => {
      this.edges.add([rId, id])
    })
  }
}
