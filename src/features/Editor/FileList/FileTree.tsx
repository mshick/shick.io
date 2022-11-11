import { useQuery } from 'graphql-hooks'
import { atom } from 'jotai'
import mime from 'mime/lite'
import { repoFilesQuery } from '../queries'
import {
  NodeFile,
  ParentFile,
  Repo,
  RepoBlob,
  RepoTree,
  TextFile
} from '../types'
import { isNotNullish, isRepoTreeEntry } from '../utils'
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

function toFileTree(
  prevPath: string,
  depth: number,
  tree: RepoTree
): NodeFile[] {
  return tree.entries
    .map((entry) => {
      const basePath = prevPath === '' ? prevPath : `${prevPath}/`
      const nodePath = `${basePath}${entry.name}`
      const nodeDepth = depth + 1

      if (isRepoTreeEntry(entry)) {
        return {
          type: 'parent' as const,
          path: nodePath,
          depth: nodeDepth,
          name: entry.name,
          children: toFileTree(nodePath, nodeDepth, entry.object)
        }
      }

      if ((entry.object as RepoBlob).isBinary) {
        return {
          type: 'binary' as const,
          path: nodePath,
          depth: nodeDepth,
          name: entry.name,
          mimeType: mime.getType(entry.name) ?? undefined
        }
      }

      return {
        type: 'text' as const,
        path: nodePath,
        depth: nodeDepth,
        name: entry.name,
        mimeType: mime.getType(entry.name) ?? undefined,
        text: (entry.object as RepoBlob).text,
        language: getFileLanguage(entry.name)
      }
    })
    .filter(isNotNullish)
}

export type FileTreeProps = {
  repo: Repo
}

export function FileTree({ repo }: FileTreeProps) {
  const { loading, error, data } = useQuery(repoFilesQuery, {
    variables: {
      name: repo.name,
      owner: repo.owner,
      expression: `${repo.branch}:${repo.dataDir}`
    }
  })

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Something bad happened</div>
  }

  const tree = toFileTree(repo.dataDir, 0, data.repository.object)
  const rootAtom = atom<ParentFile>({
    type: 'parent',
    name: 'root',
    depth: 0,
    path: repo.dataDir,
    children: tree
  })

  return (
    <div className="py-4 px-2">
      <FileRoot fileAtom={rootAtom} />
    </div>
  )
}
