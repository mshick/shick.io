import { NodeFile } from '../../../types'
import { File } from './File'
import { Folder } from './Folder'

export type TreeNodeProps = {
  node: NodeFile
  path: number[]
}

export function TreeNode({ node, path }: TreeNodeProps) {
  if (node.type === 'parent') {
    return <Folder node={node} path={path} />
  }

  return <File node={node} path={path} />
}
