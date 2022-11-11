import { useQuery } from 'graphql-hooks'
import mime from 'mime/lite'
import {
  File,
  Repo,
  RepoBlob,
  RepoEntry,
  RepoTree,
  RepoTreeEntry,
  TextFile
} from '../types'
import { isTextFile } from '../utils'
import { FileRoot } from './FileRoot'

function isRepoTreeEntry(entry: RepoEntry): entry is RepoTreeEntry {
  return entry.type === 'tree'
}

const repoFilesQuery = /* GraphQL */ `
  query ($name: String!, $owner: String!, $expression: String!) {
    viewer {
      login
    }
    repository(name: $name, owner: $owner) {
      object(expression: $expression) {
        ... on Tree {
          entries {
            name
            type
            mode
            object {
              ... on Blob {
                byteSize
                text
                isBinary
              }
              ... on Tree {
                entries {
                  name
                  type
                  mode
                  object {
                    ... on Blob {
                      byteSize
                      text
                      isBinary
                    }

                    ... on Tree {
                      entries {
                        name
                        type
                        mode
                        object {
                          ... on Blob {
                            byteSize
                            text
                            isBinary
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

function isNotNullish<T>(x: T | null | undefined): x is T {
  return x !== null && x !== undefined
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
  onClickTextFile: (file: TextFile) => void
}

export function FileTree({ repo, onClickTextFile }: FileTreeProps) {
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
        onClickLeaf={(file) => {
          if (isTextFile(file)) {
            onClickTextFile(file)
          }
        }}
      />
    </div>
  )
}
