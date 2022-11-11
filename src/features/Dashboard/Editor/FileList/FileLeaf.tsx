import classNames from '#/utils/classNames'
import { DocumentTextIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { useAtom } from 'jotai'
import { MouseEventHandler, useCallback } from 'react'
import { currentFileAtom } from '../store'
import { LeafFile } from '../types'

export type FileLeafProps = {
  file: LeafFile
  depth: number
}

export function FileLeaf({ depth, file }: FileLeafProps) {
  const [currentFile, setCurrentFile] = useAtom(currentFileAtom)

  const onClicked: MouseEventHandler = useCallback(
    (event) => {
      event.stopPropagation()
      setCurrentFile(file)
    },
    [file, setCurrentFile]
  )

  return (
    <li className="cursor-pointer" onClick={onClicked}>
      <span
        className={classNames(
          depth === 0 ? 'pl-2' : '',
          depth === 1 ? 'pl-6' : '',
          depth === 2 ? 'pl-10' : '',
          file.path === currentFile?.path
            ? 'bg-indigo-200'
            : 'hover:bg-gray-200',
          'transition block truncate py-2'
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
