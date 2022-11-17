import { LeafFile, NodeFile, ParentFile } from '../types'

// export type TreeNodeLeaf = Record<string, unknown> & {
//   _id: number
//   name: string
//   children?: TreeNode[]
//   checked: number
//   isOpen?: boolean
// }

// export type TreeNodeParent = TreeNodeLeaf & {
//   children: TreeNode[]
// }

// export type TreeNode = TreeNodeParent | TreeNodeLeaf
export type TreeNodeLeaf = LeafFile
export type TreeNodeParent = ParentFile
export type TreeNode = NodeFile

export type TreeNodeInput = {
  name: string
  children?: TreeNodeInput[]
}

export type TreeNodeInputRoot = {
  name: string
  children: TreeNodeInput[]
}

export type TreeEvent = {
  type: string
  path: number[] | null
  params: unknown[]
}

export type TreeReducer = (
  tree: TreeNodeParent,
  path: number[] | null,
  ...args: any[]
) => TreeNodeParent
