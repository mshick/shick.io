import { Atom } from 'jotai'

type File = {
  type: 'text' | 'binary' | 'parent'
  depth: number
  path: string
  name: string
  mimeType?: string
  language?: 'markdown' | 'plaintext' | 'yaml' | 'plaintext' | 'mdx'
  text?: string
  children?: Atom<NodeFile>[]
  isSelected: boolean
  isDeleted: boolean
  isDirty: boolean
}

export type TextFile = File & {
  type: 'text'
  language: 'markdown' | 'plaintext' | 'yaml' | 'plaintext' | 'mdx'
  text: string
}

export type BinaryFile = File & {
  type: 'binary'
}

export type LeafFile = BinaryFile | TextFile

export type ParentFile = File & {
  type: 'parent'
  children: Atom<NodeFile>[]
}

export type NodeFile = ParentFile | LeafFile

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
