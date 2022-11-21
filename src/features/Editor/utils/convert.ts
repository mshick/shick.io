import { Atom } from 'jotai'
import mime from 'mime/lite'
import { fileAtomFamily } from '../store'
import {
  NodeFile,
  NodeFileInput,
  ParentFile,
  Repo,
  RepoBlob,
  RepoTree,
  TextFile
} from '../types'
import { isRepoTreeEntry } from './type'

export function applyNodeDefaults(input: NodeFileInput): NodeFile {
  if (input.type === 'parent') {
    return {
      type: 'parent' as const,
      selected: false,
      name: '',
      depth: 1,
      children: [],
      ...input
    }
  }

  if (input.type === 'binary') {
    return {
      type: 'binary' as const,
      selected: false,
      name: '',
      depth: 1,
      ...input
    }
  }

  if (input.type === 'text') {
    return {
      type: 'text' as const,
      selected: false,
      name: '',
      depth: 1,
      text: '',
      mimeType: mime.getType(input.name ?? '') ?? undefined,
      language: getFileLanguage(input.name ?? ''),
      ...input
    }
  }

  return {
    type: 'text' as const,
    selected: false,
    name: '',
    depth: 1,
    text: '',
    mimeType: mime.getType(input.name ?? '') ?? undefined,
    language: getFileLanguage(input.name ?? ''),
    path: input.path
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

function toFileNode(prevPath: string, depth: number) {
  return (entry: RepoTree['entries'][0]): Atom<NodeFile> => {
    const basePath = prevPath === '' ? prevPath : `${prevPath}/`
    const nodePath = `${basePath}${entry.name}`
    const nodeDepth = depth + 1

    let node: NodeFile

    if (isRepoTreeEntry(entry)) {
      node = applyNodeDefaults({
        type: 'parent' as const,
        path: nodePath,
        depth: nodeDepth,
        name: entry.name,
        children: entry.object.entries.map(toFileNode(nodePath, nodeDepth))
      })
    } else if ((entry.object as RepoBlob).isBinary) {
      node = applyNodeDefaults({
        type: 'binary' as const,
        path: nodePath,
        depth: nodeDepth,
        name: entry.name
      })
    } else {
      node = applyNodeDefaults({
        type: 'text' as const,
        path: nodePath,
        depth: nodeDepth,
        name: entry.name,
        text: (entry.object as RepoBlob).text
      })
    }

    return fileAtomFamily(node)
  }
}

export function toFileTree(repo: Repo, data: RepoTree): Atom<NodeFile> {
  const root: ParentFile = {
    type: 'parent' as const,
    name: 'root',
    depth: 0,
    path: repo.dataDir,
    children: data.entries.map(toFileNode(repo.dataDir, 0)),
    selected: false
  }

  return fileAtomFamily(root)
}
