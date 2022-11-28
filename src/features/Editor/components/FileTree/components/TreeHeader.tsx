import { Repo } from '../../../types'
import { SourceControlIcon } from '../../icons/SourceControlIcon'

export type TreeHeaderProps = {
  repo: Repo
}

export function TreeHeader({ repo }: TreeHeaderProps) {
  return (
    <div className="mx-2 h-10 px-2 w-full flex align-middle items-center border-b">
      <SourceControlIcon className="inline-block w-5 h-5 mr-2" />
      <div className="truncate">
        {repo.owner}/{repo.name}
      </div>
    </div>
  )
}
