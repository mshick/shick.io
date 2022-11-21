import { PropsWithChildren } from 'react'
import { useEditorContext } from '../data/context'
import { useEditorQuery } from '../data/hooks'
import { Repo } from '../types'
import { TreeParent } from './TreeParent'

function TreeLoading() {
  return <div>Loading...</div>
}

function TreeError({ message }: { message: string }) {
  return <div>Error: {message}</div>
}

function TreeWrapper({ children, repo }: PropsWithChildren<{ repo: Repo }>) {
  return (
    <div className="bg-neutral-100">
      <div className="mx-2 h-10 px-12 w-full flex align-middle items-center border-b">
        {repo.owner}/{repo.name}
      </div>
      <div className="py-4 px-2">{children}</div>
    </div>
  )
}

export type TreeRootProps = {
  repo: Repo
}

export function TreeRoot({ repo }: TreeRootProps) {
  const { queries } = useEditorContext()
  const { loading, error, data } = useEditorQuery({
    query: queries.getFileTree
  })

  if (loading) {
    return (
      <TreeWrapper repo={repo}>
        <div>Loading...</div>
      </TreeWrapper>
    )
  }

  if (error || !data) {
    return (
      <TreeWrapper repo={repo}>
        <div>Error: {error?.message ?? 'no data'}</div>
      </TreeWrapper>
    )
  }

  return (
    <TreeWrapper repo={repo}>
      <TreeParent parentNodeAtom={data} />
    </TreeWrapper>
  )
}
