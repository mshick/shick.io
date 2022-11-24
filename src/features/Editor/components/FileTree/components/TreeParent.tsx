import classNames from '#/utils/classNames'
import { useAtomValue } from 'jotai'
import { memo } from 'react'
import { getFileAtom } from '../../../store'
import { NodeFile } from '../../../types'
import { shallowEquals } from '../../../utils/compare'
import { TreeNode } from './TreeNode'

export type TreeParentProps = {
  node: NodeFile
  path: number[]
}

const MemoizedTreeNode = memo(TreeNode, shallowEquals)

export function TreeParent({ node, path }: TreeParentProps) {
  const parent = useAtomValue(getFileAtom(node))

  if (parent?.type !== 'parent') {
    return null
  }

  return (
    <ul className={classNames('p-0 m-0 menu bg-default text-content-700')}>
      {parent.children.map((n, i) => (
        <MemoizedTreeNode node={n} path={[...path, i]} key={n.path} />
      ))}
    </ul>
  )
}
