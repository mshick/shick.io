import classNames from '#/utils/classNames'
import { Atom, useAtomValue } from 'jotai'
import { LeafFile, NodeFile, ParentFile } from '../types'
import { FileLeaf } from './FileLeaf'
import { FileParent } from './FileParent'

export type FileRootProps = {
  parentAtom: Atom<NodeFile>
}

export type FileNodeProps = {
  parentAtom: Atom<NodeFile>
  childAtom: Atom<NodeFile>
}

function FileNode({ parentAtom, childAtom }: FileNodeProps) {
  const file = useAtomValue(childAtom)

  if (file.type === 'parent') {
    return (
      <FileParent
        parentAtom={parentAtom}
        childAtom={childAtom as Atom<ParentFile>}
      />
    )
  }

  return (
    <FileLeaf parentAtom={parentAtom} childAtom={childAtom as Atom<LeafFile>} />
  )
}

export function FileRoot({ parentAtom }: FileRootProps) {
  const parent = useAtomValue(parentAtom)

  if (parent.type !== 'parent') {
    return null
  }

  return (
    <ul className={classNames('p-0 m-0 menu bg-default text-content-700')}>
      {parent.children.map((childAtom) => (
        <FileNode
          parentAtom={parentAtom}
          childAtom={childAtom}
          key={`${childAtom}`}
        />
      ))}
    </ul>
  )
}
