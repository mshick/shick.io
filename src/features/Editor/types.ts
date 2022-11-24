import { SetRequired } from 'type-fest'

type File = {
  oid: string
  type: 'text' | 'binary' | 'parent'
  path: string
  name: string
  mimeType?: string
  language?: 'markdown' | 'plaintext' | 'yaml' | 'plaintext' | 'mdx'
  text?: string
  initialText?: string
  children?: NodeFile[]
  isSelected: boolean
  isDeleted: boolean
  isDirty: boolean
}

export type TextFile = SetRequired<File, 'text'> & {
  type: 'text'
  language: 'markdown' | 'plaintext' | 'yaml' | 'plaintext' | 'mdx'
}

export type BinaryFile = File & {
  type: 'binary'
}

export type ParentFile = SetRequired<File, 'children'> & {
  type: 'parent'
}

export type LeafFile = BinaryFile | TextFile
export type NodeFile = ParentFile | LeafFile

// export type FileEntry = Omit<NodeFile, 'children'> & {
//   children?: FileEntry[]
// }

export type NodeFileInput = Partial<NodeFile> & {
  path: string
}

export type NodeFilePath = {
  path: string
}

export type NodeFileDeletion = NodeFilePath

export type NodeFileAddition = NodeFilePath & {
  contents: string
}

export type NodeFileUpdateText = NodeFilePath & {
  text: string
}

export type Repo = {
  name: string
  owner: string
  branch: string
  dataDir: string
}

export type RepoBlob = {
  oid: string
  byteSize: number
  text: string
  isBinary: boolean
}

export type RepoTree = {
  oid: string
  entries: RepoEntry[]
}

export type RepoBlobEntry = {
  name: string
  type: 'blob'
  object: RepoBlob
}

export type RepoTreeEntry = {
  name: string
  type: 'tree'
  object: RepoTree
}

export type RepoEntry = RepoTreeEntry | RepoBlobEntry
