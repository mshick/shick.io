import { atom, Atom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { NodeFile, ParentFile } from './types'

export const fileAtomFamily = atomFamily<NodeFile, Atom<NodeFile>>(
  (file) => atom(file),
  (a, b) => a.path === b.path
)

// export const currentFileAtomAtom = atom<Atom<NodeFile | null>>(atom(null))

const currAtomAtom = atom(atom<NodeFile | null>(null))

export const currentFileAtomAtom = atom<
  Atom<NodeFile | null>,
  Atom<NodeFile | null>
>(
  (get) => get(currAtomAtom),
  (get, set, updateAtom) => {
    const currAtom = get(currAtomAtom)
    const curr = get(currAtom)

    if (curr) {
      set(currAtom, { ...curr, selected: false })
    }

    const update = get(updateAtom)
    set(updateAtom, { ...update, selected: true })
    set(currAtomAtom, updateAtom)
  }
)

export const currentFilePath = atom<string | null>(null)
export const fileTreeAtom = atom<ParentFile | null>(null)
