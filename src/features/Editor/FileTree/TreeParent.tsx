import classNames from '#/utils/classNames'
import { Atom, useAtomValue } from 'jotai'
import { memo } from 'react'
import { NodeFile } from '../types'
import { shallowEquals } from '../utils/compare'
import { TreeNode } from './TreeNode'

export type TreeParentProps = {
  parentNodeAtom: Atom<NodeFile>
}

const MemoizedTreeNode = memo(TreeNode, shallowEquals)

export function TreeParent({ parentNodeAtom }: TreeParentProps) {
  const parentNode = useAtomValue(parentNodeAtom)

  if (parentNode.type !== 'parent') {
    return null
  }

  return (
    <ul className={classNames('p-0 m-0 menu bg-default text-content-700')}>
      {parentNode.children.map((nodeAtom) => (
        <MemoizedTreeNode nodeAtom={nodeAtom} key={`${nodeAtom}`} />
      ))}
    </ul>
  )
}
