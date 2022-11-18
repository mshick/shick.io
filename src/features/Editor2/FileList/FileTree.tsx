import { useContext } from 'react'
import { Repo } from '../types'
import { TreeStateContext } from '../useTreeState/context'
import { FileRoot } from './FileRoot'

export type FileTreeProps = {
  repo: Repo
}

export function FileTree({ repo }: FileTreeProps) {
  const { treeState } = useContext(TreeStateContext)

  if (!treeState) {
    return null
  }

  return (
    <div className="py-4 px-2">
      <FileRoot parent={treeState} path={[]} />
    </div>
  )
}
