import classNames from '#/utils/classNames'
import { DocumentTextIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { MouseEventHandler, useCallback, useContext } from 'react'
import { TreeStateContext } from '../useTreeState/context'
import { TreeNodeLeaf } from '../useTreeState/types'

export type FileLeafProps = {
  child: TreeNodeLeaf
  path: number[]
}

export function FileLeaf({ child, path }: FileLeafProps) {
  const { methods } = useContext(TreeStateContext)
  // const [currentFileAtom, setCurrentFileAtom] = useAtom(currentFileAtomAtom)
  // const currentFile = useAtomValue(currentFileAtom.childAtom)

  const onClicked: MouseEventHandler = useCallback(
    (event) => {
      event.stopPropagation()
      console.log({ path })
      methods.checkNode(path, 1)
      // setCurrentFileAtom({ parentAtom, childAtom })
    },
    [methods, path]
  )

  return (
    <li className="cursor-pointer" onClick={onClicked}>
      <span
        className={classNames(
          child.depth === 1 ? 'pl-2' : '',
          child.depth === 2 ? 'pl-6' : '',
          child.depth === 3 ? 'pl-10' : '',
          // child.path === currentFile?.path
          //   ? 'bg-indigo-200'
          //   : 'hover:bg-gray-200',
          'transition block truncate py-2'
        )}
      >
        {child.type === 'text' ? (
          <DocumentTextIcon className="inline-block w-5 h-5 mr-2 stroke-current" />
        ) : (
          <PhotoIcon className="inline-block w-5 h-5 mr-2 stroke-current" />
        )}

        {child.name}
      </span>
    </li>
  )
}
