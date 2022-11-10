import classNames from '#/utils/classNames'
import { DocumentTextIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { useMemo } from 'react'
import { LeafFile, ParentFile } from '../types'
import { isParentFile } from '../utils'
import { FileLeaf } from './FileLeaf'
import { FileParent } from './FileParent'

export type FileRootProps = {
  tree: ParentFile
  depth: number
  onClickLeaf: (file: LeafFile) => void
}

export function FileRoot({ tree, depth, onClickLeaf }: FileRootProps) {
  const color = useMemo(
    () => Math.floor(Math.random() * 16777215).toString(16),
    []
  )

  return (
    <ul
      className={classNames(
        // depth === 0 ? 'border-l-0' : '',
        // depth === 1 ? 'border-l-fuchsia-300' : '',
        // depth === 2 ? 'border-l-cyan-300' : '',
        'px-2 py-0 ml-2 mb-0 mt-0 menu bg-default text-content-700'
      )}
    >
      {tree.children.map((file) => {
        if (isParentFile(file)) {
          return (
            <FileParent
              key={file.name}
              depth={depth}
              file={file}
              onClickLeaf={onClickLeaf}
            />
          )
        }

        return (
          <FileLeaf key={file.name} file={file} onClick={onClickLeaf}>
            <span className="hover:bg-gray-100 transition block p-2 truncate">
              {file.type === 'text' ? (
                <DocumentTextIcon className="inline-block w-5 h-5 mr-2 stroke-current" />
              ) : (
                <PhotoIcon className="inline-block w-5 h-5 mr-2 stroke-current" />
              )}

              {file.name}
            </span>
          </FileLeaf>
        )
      })}
    </ul>
  )
}
