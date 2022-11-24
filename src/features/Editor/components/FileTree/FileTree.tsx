import { useFileTreeQuery } from '../../data/hooks'
import { useFileTree } from '../../store'
import { NodeFile, Repo } from '../../types'
import { TreeActions } from './components/TreeActions'
import { TreeHeader } from './components/TreeHeader'
import { TreeRoot } from './components/TreeRoot'

export type FileTreeProps = {
  repo: Repo
}

export function FileTree({ repo }: FileTreeProps) {
  const { error, data, refetch, isRefetching } = useFileTreeQuery()
  const { loaded } = useFileTree({ fileTree: data, isRefetching })

  if (error) {
    return (
      <div className="bg-neutral-100">
        <TreeHeader repo={repo} onRefresh={refetch} />
        <div>Error: {(error as Error)?.message ?? 'no data'}</div>
      </div>
    )
  }

  if (!loaded) {
    return (
      <div className="bg-neutral-100">
        <TreeHeader repo={repo} onRefresh={refetch} />
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="bg-neutral-100 flex flex-col">
      <TreeHeader repo={repo} onRefresh={refetch} />
      <div className="flex-grow">
        <TreeRoot node={data as NodeFile} />
      </div>
      <TreeActions />
    </div>
  )
}
