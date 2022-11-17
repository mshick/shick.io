import classNames from '#/utils/classNames'
import { TreeNode, TreeNodeParent } from '../useTreeState/types'
import { FileLeaf } from './FileLeaf'
import { FileParent } from './FileParent'

export type FileRootProps = {
  parent: TreeNodeParent
  path: number[]
}

export type FileNodeProps = {
  child: TreeNode
  path: number[]
}

function FileNode({ child, path }: FileNodeProps) {
  if (child.type === 'parent') {
    return <FileParent child={child} path={path} />
  }

  return <FileLeaf child={child} path={path} />
}

export function FileRoot({ parent, path }: FileRootProps) {
  if (parent.type !== 'parent') {
    return null
  }

  return (
    <ul className={classNames('p-0 m-0 menu bg-default text-content-700')}>
      {parent.children.map((child, idx) => (
        <FileNode child={child} key={child._id} path={[...path, idx]} />
      ))}
    </ul>
  )
}
