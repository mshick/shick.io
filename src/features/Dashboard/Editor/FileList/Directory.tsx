import { Transition } from '@headlessui/react'
import React, { MouseEventHandler, useCallback, useState } from 'react'
import { File } from '../types'
import { DirectoryIcon } from './Icons/Directory'
import { Item } from './Item'
import { Tree } from './Tree'

export function Directory({
  item,
  setShow,
  onClickFile
}: React.PropsWithChildren<{
  item: File
  setShow: (s: boolean) => void
  onClickFile: (file: File) => void
}>) {
  const [toggle, setToggle] = useState<boolean>(false)

  const onItemClicked: MouseEventHandler = useCallback(
    (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
      event.stopPropagation()
      setToggle(!toggle)
      setShow(false)
    },
    [setShow, toggle]
  )

  return (
    <Item
      onClick={onItemClicked}
      onContextMenu={(e: MouseEvent) => e.preventDefault()}
    >
      <span className=" hover:bg-gray-100 transition block pl-0 p-2 truncate">
        <DirectoryIcon />
        {item.title}
      </span>
      <Transition
        show={toggle}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Tree root={item} onClickFile={onClickFile} />
      </Transition>
    </Item>
  )
}
