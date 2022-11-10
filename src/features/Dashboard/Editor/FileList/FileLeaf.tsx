import { MouseEventHandler, PropsWithChildren, useCallback } from 'react'
import { LeafFile } from '../types'

export type FileLeafProps = PropsWithChildren<{
  file: LeafFile
  onClick: (file: LeafFile) => void
}>

export function FileLeaf({ children, file, onClick }: FileLeafProps) {
  const onClicked: MouseEventHandler = useCallback(
    (event) => {
      event.stopPropagation()
      onClick(file)
    },
    [file, onClick]
  )

  return (
    <li className="cursor-pointer" onClick={onClicked}>
      {children}
    </li>
  )
}
