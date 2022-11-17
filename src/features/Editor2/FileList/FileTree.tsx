import { useQuery } from 'graphql-hooks'
import { useCallback, useEffect } from 'react'
import { TreeContext } from '../context'
import { repoFilesQuery } from '../queries'
import { Repo, RepoTree } from '../types'
import { findTargetNode, useTreeState } from '../useTreeState'
import { FileRoot } from './FileRoot'

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

  const onChange = useCallback((t: any, e: any) => {
    console.log('tree change event', e)
    if (e.path) {
      console.log(findTargetNode(t, e.path))
    }
  }, [])

  const { treeState, setTreeState, methods } = useTreeState({ onChange, repo })

  useEffect(() => {
    if (data) {
      setTreeState(data.repository.object)
    }
  }, [data, repo, setTreeState])

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
    <div className="py-4 px-2">
      <TreeContext.Provider value={methods}>
        <FileRoot parent={treeState} path={[]} />
      </TreeContext.Provider>
    </div>
  )
}
