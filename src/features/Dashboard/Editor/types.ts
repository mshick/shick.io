export type TextFile = {
  type: 'text'
  path: string
  name: string
  mimeType?: string
  language: 'markdown' | 'plaintext' | 'yaml' | 'plaintext' | 'mdx'
  text: string
}

export type BinaryFile = {
  type: 'binary'
  path: string
  name: string
  mimeType?: string
}

export type LeafFile = BinaryFile | TextFile

export type ParentFile = {
  type: 'parent'
  path: string
  name: string
  children: File[]
}

export type File = ParentFile | LeafFile

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
