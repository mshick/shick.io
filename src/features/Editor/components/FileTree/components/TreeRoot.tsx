import { NodeFile } from '../../../types'
import { TreeParent } from './TreeParent'

export type TreeRootProps = {
  node: NodeFile
}

export function TreeRoot({ node }: TreeRootProps) {
  return (
    <div className="py-4 px-2">
      <TreeParent node={node} path={[]} />
    </div>
  )
}
