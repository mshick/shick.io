import { getParentPath } from '#/features/Editor/utils/path'
import { QueryFunctionContext } from '@tanstack/react-query'
import { GraphQLClient } from 'graphql-request'
import { Repo } from '../../../types'
import { toNodeFile, toNodeFileTree } from '../../../utils/convert'
import {
  commitChangesQuery,
  headOidQuery,
  repoFileQuery,
  repoFilesQuery
} from './queries'

export type GetQueriesOptions = {
  accessToken: string
  repo: Repo
}

export type GetFileTreeOptions = {
  variables?: Record<string, unknown>
}

export type CommitChangesOptions = {
  message?: {
    headline?: string
  }
  fileChanges: {
    additions?: {
      path: string
      contents: string
    }[]
    deletions?: {
      path: string
    }[]
  }
}

type HeadOidResponse = {
  repository: {
    defaultBranchRef: {
      target: {
        history: {
          nodes: [
            {
              oid: string
            }
          ]
        }
      }
    }
  }
}

type CommitChangesResponse = {
  clientMutationId: string
}

export function getMethods(options: GetQueriesOptions) {
  const { accessToken, repo } = options

  const client = new GraphQLClient('https://api.github.com/graphql', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  return {
    getFileTree: async () => {
      const data = await client.request(repoFilesQuery, {
        name: repo.name,
        owner: repo.owner,
        expression: `${repo.branch}:${repo.dataDir}`
      })

      return toNodeFileTree(repo, data.repository.object)
    },
    getFile: async ({ queryKey }: QueryFunctionContext<string[]>) => {
      const [path, oid] = queryKey ?? []

      const data = await client.request(repoFileQuery, {
        name: repo.name,
        owner: repo.owner,
        oid
      })

      return toNodeFile(getParentPath(path))(data.repository)
    },
    commitChanges: async (options?: CommitChangesOptions) => {
      if (!options?.fileChanges) {
        throw new Error('variables are required')
      }

      const headOidResponse = await client.request<HeadOidResponse>(
        headOidQuery,
        {
          name: repo.name,
          owner: repo.owner
        }
      )

      const expectedHeadOid =
        headOidResponse.repository.defaultBranchRef.target.history.nodes[0].oid

      if (!expectedHeadOid) {
        throw new Error('could not get HEAD oid')
      }

      const data = await client.request<CommitChangesResponse>(
        commitChangesQuery,
        {
          input: {
            message: {
              headline: 'commit from teddi',
              ...options.message
            },
            fileChanges: {
              ...options.fileChanges
            },
            branch: {
              repositoryNameWithOwner: `${repo.owner}/${repo.name}`,
              branchName: repo.branch
            },
            expectedHeadOid
          }
        }
      )

      return data
    }
  }
}
