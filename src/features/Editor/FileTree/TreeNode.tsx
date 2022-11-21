import { Atom, useAtomValue } from 'jotai'
import { LeafFile, NodeFile, ParentFile } from '../types'
import { File } from './File'
import { Folder } from './Folder'

export type TreeNodeProps = {
  nodeAtom: Atom<NodeFile>
}

export function TreeNode({ nodeAtom }: TreeNodeProps) {
  const node = useAtomValue(nodeAtom)

  if (node.type === 'parent') {
    return <Folder folderAtom={nodeAtom as Atom<ParentFile>} />
  }

  return <File fileAtom={nodeAtom as Atom<LeafFile>} />
}
