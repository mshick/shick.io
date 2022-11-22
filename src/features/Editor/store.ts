import { atom, useAtom, useAtomValue, useSetAtom, WritableAtom } from 'jotai'
import { atomFamily, atomWithReset } from 'jotai/utils'
import { useCallback, useMemo } from 'react'
import {
  NodeFile,
  NodeFileAddition,
  NodeFileDeletion,
  NodeFileInput,
  NodeFilePath,
  NodeFileUpdateText
} from './types'
import { applyFileDefaults } from './utils/convert'

export const fileAtomFamily = atomFamily<
  NodeFileInput,
  WritableAtom<NodeFile, NodeFile, void>
>(
  (file) => atom(applyFileDefaults(file)),
  (a, b) => a.path === b.path
)

function getParentPath(path: string) {
  return path.split('/').slice(0, -1).join('/')
}

const currentPathAtom = atom<string | null>(null)

export type FileChanges = {
  additions: {
    path: string
    contents: string
  }[]
  deletions: {
    path: string
  }[]
}

const fileChangesDefaults = {
  additions: [],
  deletions: []
}

const fileChangesAtom = atomWithReset<FileChanges>(fileChangesDefaults)

const addDeletionAtom = atom<null, NodeFileDeletion>(null, (get, set, file) => {
  const { path } = file
  const fileChanges = get(fileChangesAtom)

  const existingIndex = fileChanges.deletions.findIndex(
    (file) => file.path === path
  )

  if (existingIndex > -1) {
    return
  }

  set(fileChangesAtom, {
    ...fileChanges,
    deletions: [...fileChanges.deletions, { path }]
  })
})

const removeDeletionAtom = atom<null, NodeFileDeletion>(
  null,
  (get, set, file) => {
    const { path } = file
    const fileChanges = get(fileChangesAtom)

    const existingIndex = fileChanges.deletions.findIndex(
      (file) => file.path === path
    )

    if (existingIndex === -1) {
      return
    }

    const deletions = [
      ...fileChanges.deletions.slice(0, existingIndex),
      ...fileChanges.deletions.slice(existingIndex + 1)
    ]

    set(fileChangesAtom, {
      ...fileChanges,
      deletions
    })
  }
)

const addAdditionAtom = atom<null, NodeFileAddition>(null, (get, set, file) => {
  const { path, contents } = file
  const fileChanges = get(fileChangesAtom)

  const existing = fileChanges.additions.find((file) => file.path === path)

  if (existing) {
    return
  }

  set(fileChangesAtom, {
    ...fileChanges,
    additions: [
      ...fileChanges.additions,
      { path, contents: Buffer.from(contents).toString('base64') }
    ]
  })
})

const removeAdditionAtom = atom<null, NodeFileDeletion>(
  null,
  (get, set, file) => {
    const { path } = file
    const fileChanges = get(fileChangesAtom)

    const existingIndex = fileChanges.additions.findIndex(
      (file) => file.path === path
    )

    if (existingIndex === -1) {
      return
    }

    const additions = [
      ...fileChanges.additions.slice(0, existingIndex),
      ...fileChanges.additions.slice(existingIndex + 1)
    ]

    set(fileChangesAtom, {
      ...fileChanges,
      additions
    })
  }
)

export const updateFileTextAtom = atom<null, NodeFileUpdateText>(
  null,
  (get, set, update) => {
    const fileAtom = fileAtomFamily(update)
    const file = get(fileAtom)
    set(fileAtom, { ...file, ...update, isDirty: true })
  }
)

export const selectFileAtom = atom<null, NodeFilePath | null>(
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

export const removeFileAtom = atom<null, NodeFilePath>(
  null,
  (get, set, node) => {
    const fileAtom = fileAtomFamily(node)
    const file = get(fileAtom)
    set(fileAtom, { ...file, isDeleted: true })
  }
)

export const restoreFileAtom = atom<null, NodeFilePath>(
  null,
  (get, set, node) => {
    const fileAtom = fileAtomFamily(node)
    const file = get(fileAtom)
    set(fileAtom, { ...file, isDeleted: false })
  }
)

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

  const addAddition = useSetAtom(addAdditionAtom)
  const removeAddition = useSetAtom(removeAdditionAtom)

  const addDeletion = useSetAtom(addDeletionAtom)
  const removeDeletion = useSetAtom(removeDeletionAtom)

  const _removeFile = useSetAtom(removeFileAtom)
  const _restoreFile = useSetAtom(restoreFileAtom)
  const _selectFile = useSetAtom(selectFileAtom)
  const _updateFileText = useSetAtom(updateFileTextAtom)

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
      addDeletion(file)
      _removeFile(file)
    }
  }, [_removeFile, addDeletion, file])

  const restoreFile = useCallback(() => {
    if (file) {
      removeDeletion(file)
      _restoreFile(file)
    }
  }, [_restoreFile, file, removeDeletion])

  const selectFile = useCallback(() => {
    _selectFile(file)
  }, [_selectFile, file])

  const updateFileText = useCallback(
    (text: string) => {
      if (file) {
        addAddition({ ...file, contents: text })
        _updateFileText({ ...file, text })
      }
    },
    [_updateFileText, addAddition, file]
  )

  return {
    file,
    renameFile,
    removeFile,
    restoreFile,
    selectFile,
    updateFileText
  }
}
