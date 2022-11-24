import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { MouseEventHandler, useCallback } from 'react'
import { Repo } from '../../../types'

export type TreeHeaderProps = {
  repo: Repo
  onRefresh: () => void
}

export function TreeHeader({ repo, onRefresh }: TreeHeaderProps) {
  const handleRefresh: MouseEventHandler = useCallback(() => {
    onRefresh()
  }, [onRefresh])

  return (
    <div className="mx-2 h-10 px-2 w-full flex align-middle items-center border-b">
      <button onClick={handleRefresh}>
        <ArrowPathIcon className="inline-block w-5 h-5 mr-2" />
      </button>
      <div className="truncate">
        {repo.owner}/{repo.name}
      </div>
    </div>
  )
}
