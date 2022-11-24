import classNames from '#/utils/classNames'
import { Transition } from '@headlessui/react'
import { FolderIcon, FolderOpenIcon } from '@heroicons/react/24/outline'
import { useAtomValue } from 'jotai'
import React, { MouseEventHandler, useCallback, useState } from 'react'
import { getFileAtom } from '../../store'
import { NodeFile } from '../../types'
import { TreeParent } from './TreeParent'

export type DirectoryProps = {
  node: NodeFile
  path: number[]
}

export function Folder({ node, path }: DirectoryProps) {
  const folder = useAtomValue(getFileAtom(node))
  const [toggle, setToggle] = useState<boolean>(false)

  const onClicked: MouseEventHandler = useCallback(
    (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
      event.stopPropagation()
      setToggle(!toggle)
    },
    [toggle]
  )

  if (!folder) {
    return null
  }

  return (
    <li className="cursor-pointer" onClick={onClicked}>
      <span
        className={classNames(
          path.length === 1 ? 'pl-2' : '',
          path.length === 2 ? 'pl-6' : '',
          path.length === 3 ? 'pl-10' : '',
          'hover:bg-gray-100 transition block truncate py-2'
        )}
      >
        {toggle ? (
          <FolderOpenIcon className="inline-block w-5 h-5 mr-2 stroke-current" />
        ) : (
          <FolderIcon className="inline-block w-5 h-5 mr-2 stroke-current" />
        )}
        {folder.name}
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
        <TreeParent node={node} path={path} />
      </Transition>
    </li>
  )
}
