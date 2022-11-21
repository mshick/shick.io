import {
  atom,
  Atom,
  useAtom,
  useAtomValue,
  useSetAtom,
  WritableAtom
} from 'jotai'
import { atomFamily } from 'jotai/utils'
import { useCallback, useMemo } from 'react'
import { NodeFile, NodeFileInput, ParentFile } from './types'
import { applyNodeDefaults } from './utils/convert'

export const fileAtomFamily = atomFamily<
  NodeFileInput,
  WritableAtom<NodeFile, NodeFile, void>
>(
  (file) => atom(applyNodeDefaults(file)),
  (a, b) => a.path === b.path
)

function getParentPath(path: string) {
  return path.split('/').slice(0, -1).join('/')
}

const currentPathAtom = atom<string | null>(null)

export const parentNodeAtomAtom = atom((get) => {
  const currentPath = get(currentPathAtom)
  if (currentPath) {
    const path = getParentPath(currentPath)
    return fileAtomFamily({ path })
  }

  return atom(null)
})

export const nodeAtomAtom = atom<Atom<NodeFile | null>>((get) => {
  const currentPath = get(currentPathAtom)
  if (currentPath) {
    return fileAtomFamily({ path: currentPath })
  }

  return atom(null)
})

export const updateFileAtom = atom<null, NodeFile>(null, (get, set, update) => {
  const fileAtom = fileAtomFamily(update)
  const file = get(fileAtom)
  set(fileAtom, { ...file, ...update })
})

export const selectNodeAtom = atom<null, NodeFile | null>(
  null,
  (get, set, update) => {
    const filepath = get(currentPathAtom)
    if (filepath) {
      const prevAtom = fileAtomFamily({ path: filepath })
      const prev = get(prevAtom)
      set(prevAtom, { ...prev, selected: false })
    }

    if (update) {
      const nextAtom = fileAtomFamily(update)
      const next = get(nextAtom)
      set(nextAtom, { ...next, selected: true })
      set(currentPathAtom, update.path)
      return
    }

    set(currentPathAtom, null)
  }
)

export const removeFileAtom = atom<null, NodeFile>(null, (get, set, node) => {
  const parentPath = getParentPath(node.path)
  const parentAtom = fileAtomFamily({ path: parentPath })
  const parent = get(parentAtom) as ParentFile
  const childIndex = parent.children.findIndex((childAtom) => {
    const c = get(childAtom)
    return c.path === node.path
  })

  const children = [
    ...parent.children.slice(0, childIndex),
    ...parent.children.slice(childIndex + 1)
  ]

  set(parentAtom, {
    ...parent,
    children
  })
})

// export const addTextFileAtom = atom<null, ParentFile>(null, (get, set, node) => {
//   const parentAtom = fileAtomFamily({ path: node.path })
//   const parent = get(parentAtom) as ParentFile

//   const children = [
//     applyNodeDefaults({})
//     ...parent.children.slice(0, childIndex),
//     ...parent.children.slice(childIndex + 1)
//   ]

//   set(parentAtom, {
//     ...parent,
//     children
//   })
// })

export function useFileAtom() {
  const currentPath = useAtomValue(currentPathAtom)
  const fileAtom = useMemo(
    () =>
      currentPath
        ? fileAtomFamily({ path: currentPath })
        : (atom(null) as WritableAtom<null, NodeFile | null, void>),
    [currentPath]
  )

  const [file, setFile] = useAtom(fileAtom)

  const _removeFile = useSetAtom(removeFileAtom)
  const _selectNode = useSetAtom(selectNodeAtom)

  const renameFile = useCallback(
    (name: string) => {
      if (file) {
        const parentPath = getParentPath(file.path)
        setFile({ ...file, name, path: `${parentPath}/${name}` })
      }
    },
    [file, setFile]
  )

  const removeFile = useCallback(() => {
    if (file) {
      _removeFile(file)
      _selectNode(null)
    }
  }, [_removeFile, _selectNode, file])

  const selectFile = useCallback(() => {
    _selectNode(file)
  }, [_selectNode, file])

  return {
    file,
    renameFile,
    removeFile,
    selectFile
  }
}
