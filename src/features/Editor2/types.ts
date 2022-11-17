export type TextFile = {
  _id: number
  checked: number
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
  _id: number
  checked: number
  type: 'binary'
  depth: number
  path: string
  name: string
  mimeType?: string
  selected: boolean
}

export type LeafFile = BinaryFile | TextFile

export type ParentFile = {
  _id: number
  checked: number
  isOpen: boolean
  type: 'parent'
  depth: number
  path: string
  name: string
  children: NodeFile[]
  selected: boolean
}

export type NodeFile = ParentFile | LeafFile

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
