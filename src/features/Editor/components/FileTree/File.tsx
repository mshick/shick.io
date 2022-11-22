import classNames from '#/utils/classNames'
import { DocumentTextIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { Atom, useAtomValue, useSetAtom } from 'jotai'
import { MouseEventHandler, useCallback } from 'react'
import { selectFileAtom } from '../../store'
import { LeafFile } from '../../types'

export type FileProps = {
  fileAtom: Atom<LeafFile>
}

export function File({ fileAtom }: FileProps) {
  const file = useAtomValue(fileAtom)
  const setSelectedNode = useSetAtom(selectFileAtom)

  const onClicked: MouseEventHandler = useCallback(
    (event) => {
      event.stopPropagation()
      setSelectedNode(file)
    },
    [file, setSelectedNode]
  )

  return (
    <li className="cursor-pointer" onClick={onClicked}>
      <span
        className={classNames(
          file.isDeleted ? 'text-gray-500 line-through' : '',
          file.depth === 1 ? 'pl-2' : '',
          file.depth === 2 ? 'pl-6' : '',
          file.depth === 3 ? 'pl-10' : '',
          file.isSelected ? 'bg-indigo-200' : 'hover:bg-gray-200',
          'block truncate py-2'
        )}
      >
        {file.type === 'text' ? (
          <DocumentTextIcon className="inline-block w-5 h-5 mr-2 stroke-current" />
        ) : (
          <PhotoIcon className="inline-block w-5 h-5 mr-2 stroke-current" />
        )}

        {file.name}
      </span>
    </li>
  )
}
