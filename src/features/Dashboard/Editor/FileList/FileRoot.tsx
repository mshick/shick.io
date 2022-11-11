import classNames from '#/utils/classNames'
import { ParentFile } from '../types'
import { isParentFile } from '../utils'
import { FileLeaf } from './FileLeaf'
import { FileParent } from './FileParent'

export type FileRootProps = {
  tree: ParentFile
  depth: number
}

export function FileRoot({ tree, depth }: FileRootProps) {
  return (
    <ul className={classNames('p-0 m-0 menu bg-default text-content-700')}>
      {tree.children.map((file) => {
        if (isParentFile(file)) {
          return <FileParent key={file.name} depth={depth} file={file} />
        }

        return <FileLeaf key={file.name} file={file} depth={depth} />
      })}
    </ul>
  )
}
