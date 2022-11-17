import { useCallback, useState } from 'react'
import { JsonPrimitive } from 'type-fest'
import { Repo, RepoTree } from '../types'
import { TreeEvent, TreeNode, TreeNodeParent, TreeReducer } from './types'
import {
  addNode,
  checkNode,
  deleteNode,
  findAllTargetPathByProp,
  findTargetNode,
  findTargetPathByProp,
  getEvent,
  initializeTreeState,
  renameNode,
  toggleOpen
} from './utils'

export type TreeStateHookProps = {
  repo: Repo
  options?: {
    initCheckedStatus?: 'checked' | 'unchecked'
    initOpenStatus?: 'open' | 'closed'
  }
  onChange?: (root: TreeNodeParent | null, event: TreeEvent) => void
}

function useTreeState({ onChange, repo, options = {} }: TreeStateHookProps) {
  const { initCheckedStatus, initOpenStatus } = options

  const initTreeState = useCallback(
    (initialData: RepoTree) =>
      initializeTreeState(initialData, repo, initCheckedStatus, initOpenStatus),
    [initCheckedStatus, initOpenStatus, repo]
  )

  // const initState = useMemo(
  //   () => root && initTreeState(root),
  //   [root, initTreeState]
  // )

  const [treeState, setTreeState] = useState<TreeNodeParent | null>(null)

  // const [event, setEvent] = useState<TreeEvent>({
  //   type: 'initialization',
  //   path: null,
  //   params: []
  // })

  // const handleChange = useCallback(
  //   (e: TreeEvent) => onChange?.(treeState, e),
  //   [onChange, treeState]
  // )

  // useEffect(() => {
  //   handleChange(event)
  // }, [event, handleChange])

  const _setTreeState = useCallback(
    (data: RepoTree) => {
      const state = initTreeState(data)
      setTreeState(state)
      onChange?.(state, getEvent('setTreeState', null))
    },
    [initTreeState, onChange]
  )

  const getMethod = useCallback(
    (reducer: TreeReducer, name: string) =>
      (path: null | number[], ...args: any[]) => {
        const _path = path ? [...path] : null
        const e = getEvent(name, _path, ...args)
        const newState = treeState && reducer(treeState, _path, ...args)

        setTreeState(newState)
        onChange?.(newState, e)
      },
    [onChange, treeState]
  )

  const getReducerByProp = useCallback(
    (reducer: ReturnType<typeof getMethod>) =>
      (
        propName: keyof TreeNode,
        targetValue: JsonPrimitive,
        ...args: any[]
      ) => {
        const path =
          treeState && findTargetPathByProp(treeState, propName, targetValue)
        return path ? reducer(path, ...args) : null
      },
    [treeState]
  )

  const methods = {
    checkNode: getMethod(checkNode, 'checkNode'),
    renameNode: getMethod(renameNode, 'renameNode'),
    deleteNode: getMethod(deleteNode, 'deleteNode'),
    addNode: getMethod(addNode, 'addNode'),
    toggleOpen: getMethod(toggleOpen, 'toggleOpen')
  }

  return {
    treeState,
    setTreeState: _setTreeState,
    methods: {
      ...methods,
      checkNodeByProp: getReducerByProp(methods.checkNode),
      renameNodeByProp: getReducerByProp(methods.renameNode),
      deleteNodeByProp: getReducerByProp(methods.deleteNode),
      addNodeByProp: getReducerByProp(methods.addNode),
      toggleOpenByProp: getReducerByProp(methods.toggleOpen)
    }
  }
}

export {
  useTreeState,
  findTargetNode,
  findAllTargetPathByProp,
  findTargetPathByProp
}
