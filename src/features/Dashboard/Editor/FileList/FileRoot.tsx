import classNames from '#/utils/classNames'
import { DocumentTextIcon, PhotoIcon } from '@heroicons/react/24/outline'
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
  return (
    <ul className={classNames('p-0 m-0 menu bg-default text-content-700')}>
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
            <span
              className={classNames(
                depth === 0 ? 'pl-2' : '',
                depth === 1 ? 'pl-6' : '',
                depth === 2 ? 'pl-10' : '',
                'hover:bg-gray-100 transition block truncate py-2'
              )}
            >
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
