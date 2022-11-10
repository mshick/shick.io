import React, { useCallback, useMemo } from 'react'
import { File } from '../types'
import { useContextMenu } from './context'
import { Directory } from './Directory'
import { FileIcon } from './Icons/File'
import { FileItem } from './TextItem'

export type TreeProps = {
  root: File
  onClickFile: (file: File) => void
}

export function Tree({ root, onClickFile }: TreeProps) {
  const { setShow, setPosition } = useContextMenu()!
  const color_gen = useMemo(
    () => Math.floor(Math.random() * 16777215).toString(16),
    []
  )
  const onContextMenu = useCallback(
    (event: React.MouseEvent<HTMLLIElement, MouseEvent>): void => {
      event.stopPropagation()
      event.preventDefault()
      const { currentTarget } = event
      setShow(true)
      setPosition({
        x: currentTarget.offsetTop,
        y: currentTarget.offsetLeft + 40
      })
    },
    [setShow, setPosition]
  )

  return (
    <ul
      style={{ borderLeftColor: `#${color_gen}`, borderLeftWidth: 2 }}
      className="p-2 pt-0 ml-2 mb-0 mt-0 pb-0 menu bg-default text-content-700"
    >
      {root.children &&
        root.children.map((item, index) => {
          if (item.children && item.children.length > 0)
            return (
              <Directory
                key={item.title}
                item={item}
                setShow={setShow}
                onClickFile={onClickFile}
              />
            )
          return (
            <FileItem key={item.title} item={item} onClick={onClickFile}>
              <span className="hover:bg-gray-100 transition block pl-0 p-2 truncate">
                <FileIcon />
                {item.title}
              </span>
            </FileItem>
          )
        })}
    </ul>
  )
}
