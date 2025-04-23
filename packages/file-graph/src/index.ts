export { default as File, FileObject } from './file.js'
export { default as FileNode } from './fileNode.js'
export { default as FileGraph, Event } from './fileGraph.js'

export interface INode {
  path: string
  type: string
  discovered: boolean
  children?: INode[]
}
