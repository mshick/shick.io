import classNames from '#/utils/classNames'
import { Atom, atom, useAtomValue } from 'jotai'
import { splitAtom } from 'jotai/utils'
import { useMemo } from 'react'
import { LeafFile, NodeFile, ParentFile } from '../types'
import { FileLeaf } from './FileLeaf'
import { FileParent } from './FileParent'

export type FileRootProps = {
  fileAtom: Atom<ParentFile>
}

export type FileNodeProps = {
  fileAtom: Atom<NodeFile>
}

function FileNode({ fileAtom }: FileNodeProps) {
  const file = useAtomValue(fileAtom)

  if (file.type === 'parent') {
    return <FileParent fileAtom={fileAtom as Atom<ParentFile>} />
  }

  return <FileLeaf fileAtom={fileAtom as Atom<LeafFile>} />
}

export function FileRoot({ fileAtom }: FileRootProps) {
  const childrenAtom = useMemo(
    () => atom((get) => get(fileAtom)?.children ?? []),
    [fileAtom]
  )

  const childrenAtomsAtom = splitAtom(childrenAtom)
  const childrenAtoms = useAtomValue(childrenAtomsAtom)
  const node = useAtomValue(fileAtom)

  return (
    <ul className={classNames('p-0 m-0 menu bg-default text-content-700')}>
      {childrenAtoms.map((childAtom) => {
        return <FileNode fileAtom={childAtom} key={childAtom.toString()} />
      })}
    </ul>
  )
}
