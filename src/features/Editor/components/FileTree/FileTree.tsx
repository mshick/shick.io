import { useEffect } from 'react'
import { useFileTree } from '../../files/hooks'
import { Repo } from '../../types'
import { CommitModal } from './components/CommitModal'
import { ResetModal } from './components/ResetModal'
import { TreeActions } from './components/TreeActions'
import { TreeHeader } from './components/TreeHeader'
import { TreeRoot } from './components/TreeRoot'

export type FileTreeProps = {
  repo: Repo
}

export function FileTree({ repo }: FileTreeProps) {
  const [getFileTree, { error, data }] = useFileTree()

  useEffect(() => {
    getFileTree()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (error) {
    return (
      <div className="bg-neutral-100 flex flex-col">
        <TreeHeader repo={repo} />
        <div>Error: {(error as Error)?.message ?? 'no data'}</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="bg-neutral-100 flex flex-col">
        <TreeHeader repo={repo} />
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="bg-neutral-100 flex flex-col">
      <TreeHeader repo={repo} />
      <div className="flex-grow">
        <TreeRoot node={data} />
      </div>
      <TreeActions />
      <CommitModal />
      <ResetModal />
    </div>
  )
}
