import {
  NodeFile,
  ParentFile,
  RepoEntry,
  RepoTreeEntry,
  TextFile
} from './types'

export function isParentFile(file: NodeFile): file is ParentFile {
  return file.type === 'parent'
}

export function isTextFile(file: NodeFile): file is TextFile {
  return file.type === 'text'
}

export function isRepoTreeEntry(entry: RepoEntry): entry is RepoTreeEntry {
  return entry.type === 'tree'
}

export function isNotNullish<T>(x: T | null | undefined): x is T {
  return x !== null && x !== undefined
}

export function shallowEquals(
  a: Record<string, unknown>,
  b: Record<string, unknown>
): boolean {
  for (const key of Object.keys(a)) {
    if (a[key] !== b[key]) {
      return false
    }
  }

  return true
}
