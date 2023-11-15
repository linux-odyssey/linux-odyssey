export default class DAG {
  constructor(nodes) {
    this.nodes = new Map(nodes.map((node) => [node._id, node]))
    this.edges = new Set()
    this.layers = []
    this.nodes.forEach((_, id) => {
      this.setLayer(id)
      this.addEdges(id)
    })
  }

  get(id) {
    return this.nodes.get(id)
  }

  getNodes() {
    return Array.from(this.nodes.values())
  }

  getEdges() {
    return Array.from(this.edges.values())
  }

  setLayer(id) {
    console.log(`setLayer(${id})`)
    const node = this.nodes.get(id)
    if (!node) {
      throw new Error(`Node ${id} not found`)
    }
    if (node.layer !== undefined) {
      return node.layer
    }
    const previousLayer = node.requirements.map((rId) => this.setLayer(rId))
    node.layer = Math.max(...previousLayer, 0) + 1
    if (this.layers.length < node.layer) {
      this.layer.push(1)
    } else {
      this.layers[node.layer - 1] += 1
    }
    node.count = this.layers[node.layer - 1]
    return node.layer
  }

  addEdges(id) {
    const node = this.nodes.get(id)
    if (!node) {
      throw new Error(`Node ${id} not found`)
    }
    node.requirements.forEach((rId) => {
      this.edges.add([rId, id])
    })
  }
}
