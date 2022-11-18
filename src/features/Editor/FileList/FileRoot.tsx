import classNames from '#/utils/classNames'
import { Atom, useAtomValue } from 'jotai'
import { memo } from 'react'
import { LeafFile, NodeFile, ParentFile } from '../types'
import { shallowEquals } from '../utils'
import { FileLeaf } from './FileLeaf'
import { FileParent } from './FileParent'

export type FileRootProps = {
  parentAtom: Atom<NodeFile>
}

export type FileNodeProps = {
  childAtom: Atom<NodeFile>
}

const MemoizedFileNode = memo(function FileNode({ childAtom }: FileNodeProps) {
  const file = useAtomValue(childAtom)

  if (file.type === 'parent') {
    return <FileParent childAtom={childAtom as Atom<ParentFile>} />
  }

  return <FileLeaf childAtom={childAtom as Atom<LeafFile>} />
}, shallowEquals)

export function FileRoot({ parentAtom }: FileRootProps) {
  const parent = useAtomValue(parentAtom)

  if (parent.type !== 'parent') {
    return null
  }

  console.log('FileRoot', parent.path, parent.children)

  return (
    <ul className={classNames('p-0 m-0 menu bg-default text-content-700')}>
      {parent.children.map((childAtom) => (
        <MemoizedFileNode childAtom={childAtom} key={`${childAtom}`} />
      ))}
    </ul>
  )
}
