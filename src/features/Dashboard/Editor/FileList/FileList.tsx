import { useQuery } from 'graphql-hooks'
import { File } from '../types'
import { ContextMenuProvider } from './context'
import { ContextMenu } from './ContextMenu'
import { Tree } from './Tree'

type RepoBlob = {
  byteSize: number
  text: string
  isBinary: boolean
}

type RepoObject = RepoBlob | RepoTree

type RepoEntry = {
  name: string
  type: 'tree' | 'blob'
  mode: string
  object: RepoObject
}

type RepoTree = {
  entries: RepoEntry[]
}

function isRepoTree(entry: RepoObject): entry is RepoTree {
  return Boolean((entry as RepoTree).entries)
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

function toFileArray(prevPath: string, repoObject: RepoTree): File[] {
  return repoObject.entries
    .map((entry) => {
      if ((entry.object as RepoBlob).isBinary) {
        return
      }

      const basePath = prevPath === '' ? prevPath : `${prevPath}/`
      const path = `${basePath}${entry.name}`

      return {
        path,
        title: entry.name,
        language: 'markdown' as const,
        type: entry.type,
        text: (entry.object as RepoBlob).text,
        children: isRepoTree(entry.object)
          ? toFileArray(path, entry.object)
          : []
      }
    })
    .filter(isNotNullish)
}

export function FileList({ onClickFile }: any) {
  const { loading, error, data } = useQuery(repoFilesQuery, {
    variables: {
      name: 'shick.io',
      owner: 'mshick',
      expression: 'main:data'
    }
  })

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Something bad happened</div>
  }

  const root = toFileArray('data', data.repository.object)

  return (
    <ContextMenuProvider>
      <ContextMenu />
      <Tree
        root={{ title: 'root', children: root }}
        onClickFile={onClickFile}
      />
    </ContextMenuProvider>
  )
}
