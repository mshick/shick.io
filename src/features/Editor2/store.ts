import { atom, Atom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { LeafFile, NodeFile, ParentFile } from './types'

type SelectedAtom = {
  parentAtom: Atom<NodeFile | null>
  childAtom: Atom<LeafFile | null>
}

export const currentFileAtomAtom = atom<SelectedAtom>({
  parentAtom: atom(null),
  childAtom: atom(null)
})
export const currentFilePath = atom<string | null>(null)
export const fileTreeAtom = atom<ParentFile | null>(null)

export const fileAtomFamily = atomFamily<NodeFile, Atom<NodeFile>>(
  (file) => atom(file),
  (a, b) => a.path === b.path
)
