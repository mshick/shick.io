import { Atom } from 'jotai'

export type TextFile = {
  type: 'text'
  depth: number
  path: string
  name: string
  mimeType?: string
  language: 'markdown' | 'plaintext' | 'yaml' | 'plaintext' | 'mdx'
  text: string
  selected: boolean
}

export type BinaryFile = {
  type: 'binary'
  depth: number
  path: string
  name: string
  mimeType?: string
  selected: boolean
}

export type LeafFile = BinaryFile | TextFile

export type ParentFile = {
  type: 'parent'
  depth: number
  path: string
  name: string
  children: Atom<NodeFile>[]
  selected: boolean
}

export type NodeFile = ParentFile | LeafFile

export type NodeFileInput = Partial<NodeFile> & {
  path: string
}

export type State = {
  position?: {
    x: number
    y: number
  }
  show?: boolean
  setShow?: (s: boolean) => void
  setPosition?: ({ x, y }: { x: any; y: any }) => void
}

export type Repo = {
  name: string
  owner: string
  branch: string
  dataDir: string
}

export type RepoBlob = {
  byteSize: number
  text: string
  isBinary: boolean
}

export type RepoTree = {
  entries: RepoEntry[]
}

export type RepoBlobEntry = {
  name: string
  type: 'blob'
  mode: string
  object: RepoBlob
}

export type RepoTreeEntry = {
  name: string
  type: 'tree'
  mode: string
  object: RepoTree
}

export type RepoEntry = RepoTreeEntry | RepoBlobEntry
