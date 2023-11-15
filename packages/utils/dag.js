export default class DAG {
  constructor(nodes) {
    this.nodes = new Map(nodes.map((node) => [node._id, node]))
    this.edges = new Set()
  }

  format() {
    this.nodes.forEach((_, id) => {
      this.setLayer(id)
      this.addEdges(id)
    })
  }

  get(id) {
    return this.nodes.get(id)
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
