import mime from 'mime/lite'
import { SetRequired } from 'type-fest'
import {
  NodeFile,
  Repo,
  RepoBlob,
  RepoEntry,
  RepoTree,
  TextFile
} from '../types'
import { isRepoTreeEntry } from './type'

export function applyFileDefaults(
  input: SetRequired<Partial<NodeFile>, 'path' | 'oid'>
): NodeFile {
  if (input.type === 'parent') {
    return {
      type: 'parent' as const,
      isSelected: false,
      isDeleted: false,
      isDirty: false,
      name: '',
      children: [],
      ...input
    }
  }

  if (input.type === 'binary') {
    return {
      type: 'binary' as const,
      isSelected: false,
      isDeleted: false,
      isDirty: false,
      name: '',
      ...input
    }
  }

  if (input.type === 'text') {
    return {
      type: 'text' as const,
      isSelected: false,
      isDeleted: false,
      isDirty: false,
      name: '',
      text: '',
      mimeType: mime.getType(input.name ?? '') ?? undefined,
      language: getFileLanguage(input.name ?? ''),
      ...input
    }
  }

  return {
    type: 'text' as const,
    isSelected: false,
    isDeleted: false,
    isDirty: false,
    name: '',
    text: '',
    mimeType: mime.getType(input.name ?? '') ?? undefined,
    language: getFileLanguage(input.name ?? ''),
    path: input.path,
    oid: input.oid
  }
}

function getFileLanguage(name: string): TextFile['language'] {
  const ext = name.split('.').pop()
  switch (ext) {
    case 'md':
      return 'markdown'
    case 'mdx':
      return 'mdx'
    case 'yaml':
    case 'yml':
      return 'yaml'
    case 'txt':
    default:
      return 'plaintext'
  }
}

export function toNodeFile(prevPath: string) {
  return (entry: RepoEntry): NodeFile => {
    const nodePath = `${prevPath}/${entry.name}`

    if (isRepoTreeEntry(entry)) {
      return applyFileDefaults({
        oid: entry.object.oid,
        type: 'parent' as const,
        path: nodePath,
        name: entry.name,
        children: entry.object.entries.map(toNodeFile(nodePath))
      })
    } else if ((entry.object as RepoBlob).isBinary) {
      return applyFileDefaults({
        oid: entry.object.oid,
        type: 'binary' as const,
        path: nodePath,
        name: entry.name
      })
    }

    return applyFileDefaults({
      oid: entry.object.oid,
      type: 'text' as const,
      path: nodePath,
      name: entry.name,
      text: (entry.object as RepoBlob).text
    })
  }
}

export function toNodeFileTree(repo: Repo, data: RepoTree): NodeFile {
  return applyFileDefaults({
    oid: data.oid,
    type: 'parent' as const,
    name: 'root',
    path: repo.dataDir,
    children: data.entries.map(toNodeFile(repo.dataDir))
  })
}
