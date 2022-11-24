import { atom, useAtom, useAtomValue, useSetAtom, WritableAtom } from 'jotai'
import { atomFamily, atomWithReset } from 'jotai/utils'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useFileQuery } from './data/hooks'
import {
  NodeFile,
  NodeFileAddition,
  NodeFileDeletion,
  NodeFileInput,
  NodeFilePath,
  NodeFileUpdateText
} from './types'
import { getParentPath } from './utils/path'

let filePaths: Set<string> = new Set()

export const fileAtomFamily = atomFamily<
  NodeFile,
  WritableAtom<NodeFile, NodeFile, void>
>(
  (file) => atom(file),
  (a, b) => a.path === b.path
)

export function getFileAtom(file: NodeFileInput) {
  if (!filePaths.has(file.path)) {
    return atom(null) as WritableAtom<null, NodeFile | null, void>
  }

  return fileAtomFamily(file as NodeFile)
}

export function removeFileAtom(file: NodeFileInput) {
  if (!filePaths.has(file.path)) {
    return
  }

  filePaths.delete(file.path)
  fileAtomFamily.remove(file as NodeFile)
}

export function addFile(file: NodeFile) {
  filePaths.add(file.path)
  return fileAtomFamily(file)
}

export function resetFileAtoms() {
  for (const path of filePaths) {
    fileAtomFamily.remove({ path } as NodeFile)
    filePaths.delete(path)
  }
  filePaths.clear()
}

export function loadFileAtoms(file: NodeFile) {
  addFile(file)
  if (file.children) {
    file.children.forEach(loadFileAtoms)
  }
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

const _addDeletionAtom = atom<null, NodeFileDeletion>(
  null,
  (get, set, file) => {
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
  }
)

const _removeDeletionAtom = atom<null, NodeFileDeletion>(
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

const _addAdditionAtom = atom<null, NodeFileAddition>(
  null,
  (get, set, file) => {
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
  }
)

const _removeAdditionAtom = atom<null, NodeFileDeletion>(
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

const _updateFileTextAtom = atom<null, NodeFileUpdateText>(
  null,
  (get, set, update) => {
    const fileAtom = getFileAtom(update)
    const file = get(fileAtom)

    if (!file) {
      return
    }

    set(fileAtom, { ...file, ...update, isDirty: true })
  }
)

export const _selectFileAtom = atom<null, NodeFilePath | null>(
  null,
  (get, set, update) => {
    const filepath = get(currentPathAtom)
    if (filepath) {
      const prevAtom = getFileAtom({ path: filepath })
      const prev = get(prevAtom)

      if (prev) {
        set(prevAtom, { ...prev, selected: false })
      }
    }

    if (!update) {
      set(currentPathAtom, null)
      return
    }

    const nextAtom = getFileAtom(update)
    const next = get(nextAtom)

    if (next) {
      set(nextAtom, { ...next, selected: true })
      set(currentPathAtom, update.path)
    }
  }
)

const _removeFileAtom = atom<null, NodeFilePath>(null, (get, set, node) => {
  const fileAtom = getFileAtom(node)
  const file = get(fileAtom)

  if (!file) {
    return
  }

  set(fileAtom, { ...file, isDeleted: true })
})

const _restoreFileAtom = atom<null, NodeFilePath>(null, (get, set, node) => {
  const fileAtom = getFileAtom(node)
  const file = get(fileAtom)

  if (!file) {
    return
  }

  set(fileAtom, { ...file, isDeleted: false })
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
    () => getFileAtom({ path: currentPath ?? '' }),
    [currentPath]
  )

  const [file, setFile] = useAtom(fileAtom)
  const [fetchFile, fetchFileResult] = useFileQuery({
    oid: file?.oid,
    path: file?.path
  })

  const _addAddition = useSetAtom(_addAdditionAtom)
  const _removeAddition = useSetAtom(_removeAdditionAtom)

  const _addDeletion = useSetAtom(_addDeletionAtom)
  const _removeDeletion = useSetAtom(_removeDeletionAtom)

  const _removeFile = useSetAtom(_removeFileAtom)
  const _restoreFile = useSetAtom(_restoreFileAtom)
  const _selectFile = useSetAtom(_selectFileAtom)
  const _updateFileText = useSetAtom(_updateFileTextAtom)

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
      _addDeletion(file)
      _removeFile(file)
    }
  }, [_removeFile, _addDeletion, file])

  const restoreFile = useCallback(() => {
    if (file) {
      _removeDeletion(file)
      _restoreFile(file)
    }
  }, [_restoreFile, file, _removeDeletion])

  const selectFile = useCallback(() => {
    _selectFile(file)
  }, [_selectFile, file])

  const updateFileText = useCallback(
    (text: string) => {
      if (file) {
        _addAddition({ ...file, contents: text })
        _updateFileText({ ...file, text })
      }
    },
    [_updateFileText, _addAddition, file]
  )

  const resetFile = useCallback(() => {
    if (file) {
      fetchFile()
      _removeAddition(file)
      restoreFile()
    }
  }, [file, fetchFile, _removeAddition, restoreFile])

  useEffect(() => {
    if (fetchFileResult.data) {
      setFile(fetchFileResult.data)
    }
  }, [fetchFileResult, setFile])

  return {
    file,
    renameFile,
    removeFile,
    restoreFile,
    selectFile,
    updateFileText,
    resetFile
  }
}

export type FileTreeHookProps = {
  fileTree: NodeFile | undefined
  isRefetching: boolean
}

export function useFileTree({ fileTree, isRefetching }: FileTreeHookProps) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (fileTree && !loaded) {
      loadFileAtoms(fileTree)
      setLoaded(true)
    }
  }, [fileTree, loaded])

  useEffect(() => {
    if (isRefetching) {
      resetFileAtoms()
      setLoaded(false)
    }
  }, [isRefetching])

  return { loaded }
}
