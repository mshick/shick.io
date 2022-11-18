import { ClientContext, GraphQLClient, useQuery } from 'graphql-hooks'
import { useCallback, useEffect } from 'react'
import Split from 'react-split'
import { FileEditor } from './FileEditor/FileEditor'
import { FileTree } from './FileList/FileTree'
import { repoFilesQuery } from './queries'
import { Repo, RepoTree } from './types'
import { findTargetNode, useTreeState } from './useTreeState'
import { TreeStateContext } from './useTreeState/context'

export type EditorProp = {
  accessToken: string
  repo: Repo
}

export function Editor({ accessToken, repo }: EditorProp) {
  const client = new GraphQLClient({
    url: 'https://api.github.com/graphql',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  const { loading, error, data } = useQuery<{
    repository: { object: RepoTree }
  }>(repoFilesQuery, {
    client,
    variables: {
      name: repo.name,
      owner: repo.owner,
      expression: `${repo.branch}:${repo.dataDir}`
    }
  })

  const onChange = useCallback((t: any, e: any) => {
    console.log('tree change event', e)
    if (e.path) {
      console.log(findTargetNode(t, e.path))
    }
  }, [])

  const [treeState, setTreeState] = useTreeState({ onChange, repo })

  useEffect(() => {
    if (data) {
      setTreeState(data.repository.object)
    }
  }, [data, repo, setTreeState, treeState])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Something bad happened</div>
  }

  if (!treeState) {
    return <div>Something bad happened</div>
  }

  return (
    <ClientContext.Provider value={client}>
      <TreeStateContext.Provider value={treeState}>
        <Split sizes={[25, 75]} className="flex flex-row min-h-screen">
          <FileTree repo={repo} />
          <FileEditor repo={repo} />
        </Split>
      </TreeStateContext.Provider>
    </ClientContext.Provider>
  )
}
