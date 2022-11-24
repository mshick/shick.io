import classNames from '#/utils/classNames'
import { DocumentTextIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { useAtomValue, useSetAtom } from 'jotai'
import { MouseEventHandler, useCallback } from 'react'
import { getFileAtom, _selectFileAtom } from '../../../store'
import { NodeFile } from '../../../types'

export type FileProps = {
  node: NodeFile
  path: number[]
}

export function File({ node, path }: FileProps) {
  const file = useAtomValue(getFileAtom(node))
  const setSelectedNode = useSetAtom(_selectFileAtom)

  const onClicked: MouseEventHandler = useCallback(
    (event) => {
      event.stopPropagation()
      setSelectedNode(file)
    },
    [file, setSelectedNode]
  )

  if (!file) {
    return null
  }

  return (
    <li className="cursor-pointer" onClick={onClicked}>
      <span
        className={classNames(
          path.length === 1 ? 'pl-2' : '',
          path.length === 2 ? 'pl-6' : '',
          path.length === 3 ? 'pl-10' : '',
          file.isDirty ? 'text-yellow-600' : '',
          file.isDeleted ? 'text-gray-500 line-through' : '',
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
