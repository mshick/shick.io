import { useQuery } from 'graphql-hooks'
import mime from 'mime/lite'
import { repoFilesQuery } from '../queries'
import { File, Repo, RepoBlob, RepoTree, TextFile } from '../types'
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

function toFileTree(prevPath: string, tree: RepoTree): File[] {
  return tree.entries
    .map((entry) => {
      const basePath = prevPath === '' ? prevPath : `${prevPath}/`
      const path = `${basePath}${entry.name}`

      if (isRepoTreeEntry(entry)) {
        return {
          path,
          name: entry.name,
          type: 'parent' as const,
          children: toFileTree(path, entry.object)
        }
      }

      if ((entry.object as RepoBlob).isBinary) {
        return {
          type: 'binary' as const,
          path,
          name: entry.name,
          mimeType: mime.getType(entry.name) ?? undefined
        }
      }

      return {
        type: 'text' as const,
        path,
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

  const tree = toFileTree(repo.dataDir, data.repository.object)

  return (
    <div className="py-4 px-2">
      <FileRoot
        depth={0}
        tree={{
          name: 'root',
          type: 'parent',
          path: repo.dataDir,
          children: tree
        }}
      />
    </div>
  )
}
