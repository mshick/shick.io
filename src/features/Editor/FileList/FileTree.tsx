import { useQuery } from 'graphql-hooks'
import { Atom } from 'jotai'
import mime from 'mime/lite'
import { useMemo } from 'react'
import { repoFilesQuery } from '../queries'
import { fileAtomFamily } from '../store'
import {
  NodeFile,
  ParentFile,
  Repo,
  RepoBlob,
  RepoTree,
  TextFile
} from '../types'
import { isRepoTreeEntry } from '../utils'
import { FileRoot } from './FileRoot'

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

const filePaths: string[] = []

function toFileTreeRecurse(
  prevPath: string,
  depth: number,
  repoTree: RepoTree
): Atom<NodeFile>[] {
  return repoTree.entries.map((entry) => {
    const basePath = prevPath === '' ? prevPath : `${prevPath}/`
    const nodePath = `${basePath}${entry.name}`
    const nodeDepth = depth + 1
    filePaths.push(nodePath)

    let node: NodeFile

    if (isRepoTreeEntry(entry)) {
      node = {
        type: 'parent' as const,
        path: nodePath,
        depth: nodeDepth,
        name: entry.name,
        children: toFileTreeRecurse(nodePath, nodeDepth, entry.object),
        selected: false
      }
    } else if ((entry.object as RepoBlob).isBinary) {
      node = {
        type: 'binary' as const,
        path: nodePath,
        depth: nodeDepth,
        name: entry.name,
        mimeType: mime.getType(entry.name) ?? undefined,
        selected: false
      }
    } else {
      node = {
        type: 'text' as const,
        path: nodePath,
        depth: nodeDepth,
        name: entry.name,
        mimeType: mime.getType(entry.name) ?? undefined,
        text: (entry.object as RepoBlob).text,
        language: getFileLanguage(entry.name),
        selected: false
      }
    }

    return fileAtomFamily(node)
  })
}

function toFileTree(repo: Repo, data: RepoTree): Atom<NodeFile> {
  const root: ParentFile = {
    type: 'parent' as const,
    name: 'root',
    depth: 0,
    path: repo.dataDir,
    children: toFileTreeRecurse(repo.dataDir, 0, data),
    selected: false
  }

  return fileAtomFamily(root)
}

export type FileTreeProps = {
  repo: Repo
}

export function FileTree({ repo }: FileTreeProps) {
  const { loading, error, data } = useQuery<{
    repository: { object: RepoTree }
  }>(repoFilesQuery, {
    variables: {
      name: repo.name,
      owner: repo.owner,
      expression: `${repo.branch}:${repo.dataDir}`
    }
  })

  const treeAtom = useMemo(
    () => data && toFileTree(repo, data.repository.object),
    [data, repo]
  )

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Something bad happened</div>
  }

  if (!treeAtom) {
    return <div>Something bad happened</div>
  }

  return (
    <div className="py-4 px-2">
      <FileRoot parentAtom={treeAtom} />
    </div>
  )
}
