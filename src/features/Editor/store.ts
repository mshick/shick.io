import { atom, Atom } from 'jotai'
import { LeafFile } from './types'

export const currentFileAtomAtom = atom<Atom<LeafFile> | Atom<null>>(atom(null))
// export const fileAtomFamily = atomFamily((file: File) => atom(file), (a: File, b: File) => a.path === b.path)
// export const rootAtom = atom<RootFile | null>(null)
