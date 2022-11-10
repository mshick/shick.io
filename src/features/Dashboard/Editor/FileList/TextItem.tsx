import { MouseEventHandler, PropsWithChildren, useCallback } from 'react'
import { File } from '../types'

export type FileItemProps = PropsWithChildren<{
  item: File
  onClick: (file: File) => void
}>

export function FileItem({ children, item, onClick }: FileItemProps) {
  const onItemClicked: MouseEventHandler = useCallback(
    (event) => {
      event.stopPropagation()
      onClick(item)
    },
    [item, onClick]
  )

  return (
    <li className="cursor-pointer" onClick={onItemClicked}>
      {children}
    </li>
  )
}
