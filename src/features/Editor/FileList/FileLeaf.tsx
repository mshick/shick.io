import classNames from '#/utils/classNames'
import { DocumentTextIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { Atom, useAtomValue, useSetAtom } from 'jotai'
import { MouseEventHandler, useCallback } from 'react'
import { currentFileAtomAtom } from '../store'
import { LeafFile } from '../types'

export type FileLeafProps = {
  childAtom: Atom<LeafFile>
}

export function FileLeaf({ childAtom }: FileLeafProps) {
  const file = useAtomValue(childAtom)
  const setCurrentFileAtom = useSetAtom(currentFileAtomAtom)

  console.log('FileLeaf', file.path, file.selected)

  const onClicked: MouseEventHandler = useCallback(
    (event) => {
      event.stopPropagation()
      setCurrentFileAtom(childAtom)
    },
    [childAtom, setCurrentFileAtom]
  )

  return (
    <li className="cursor-pointer" onClick={onClicked}>
      <span
        className={classNames(
          file.depth === 1 ? 'pl-2' : '',
          file.depth === 2 ? 'pl-6' : '',
          file.depth === 3 ? 'pl-10' : '',
          file.selected ? 'bg-indigo-200' : 'hover:bg-gray-200',
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
