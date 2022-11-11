import { atom } from 'jotai'
import { LeafFile } from './types'

export const currentFileAtom = atom<LeafFile | null>(null)
