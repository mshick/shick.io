import classNames from '#/utils/classNames'
import { Transition } from '@headlessui/react'
import { FolderIcon, FolderOpenIcon } from '@heroicons/react/24/outline'
import React, {
  MouseEventHandler,
  PropsWithChildren,
  useCallback,
  useState
} from 'react'
import { LeafFile, ParentFile } from '../types'
import { FileRoot } from './FileRoot'

export type FileParentProps = PropsWithChildren<{
  file: ParentFile
  depth: number
  onClickLeaf: (file: LeafFile) => void
}>

export function FileParent({ file, depth, onClickLeaf }: FileParentProps) {
  const [toggle, setToggle] = useState<boolean>(false)

  const onClicked: MouseEventHandler = useCallback(
    (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
      event.stopPropagation()
      setToggle(!toggle)
    },
    [toggle]
  )

  return (
    <li className="cursor-pointer" onClick={onClicked}>
      <span
        className={classNames(
          depth === 0 ? 'pl-2' : '',
          depth === 1 ? 'pl-6' : '',
          depth === 2 ? 'pl-10' : '',
          'hover:bg-gray-100 transition block truncate py-2'
        )}
      >
        {toggle ? (
          <FolderOpenIcon className="inline-block w-5 h-5 mr-2 stroke-current" />
        ) : (
          <FolderIcon className="inline-block w-5 h-5 mr-2 stroke-current" />
        )}
        {file.name}
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
        <FileRoot depth={depth + 1} tree={file} onClickLeaf={onClickLeaf} />
      </Transition>
    </li>
  )
}
