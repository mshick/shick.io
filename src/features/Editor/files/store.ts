import { atom, WritableAtom } from 'jotai'
import { atomWithReset, atomWithStorage, RESET } from 'jotai/utils'
import {
  CreateCommitFileChanges,
  NodeFile,
  NodeFileAddition,
  NodeFileDeletion,
  NodeFileInput,
  NodeFilePath,
  NodeFileUpdateText
} from '../types'

const fileAtomMap = new Map<string, WritableAtom<NodeFile, NodeFile, void>>()

// export const fileAtomFamily = atomFamily<
//   NodeFile | null,
//   WritableAtom<NodeFile | null, NodeFile | null, void>
// >(
//   (file) => (file?.path ? atomWithStorage(file.path, file) : atom(null)),
//   (a, b) => a?.path === b?.path
// )

export function getFileAtom(file: NodeFileInput) {
  // if (!filePaths.has(file.path)) {
  //   return atom(null) as WritableAtom<null, NodeFile | null, void>
  // }

  return fileAtomMap.get(file.path) ?? atom(null)
}

// export function removeFileAtomFamily(file: NodeFileInput) {
//   if (!filePaths.has(file.path)) {
//     return
//   }

//   filePaths.delete(file.path)
//   fileAtomFamily.remove(file as NodeFile)
// }

// export function addFile(file: NodeFile) {
//   filePaths.add(file.path)
//   return fileAtomFamily(file)
// }

// export function resetFileAtoms() {
//   for (const path of filePaths) {
//     fileAtomFamily.remove({ path } as NodeFile)
//     filePaths.delete(path)
//   }
//   filePaths.clear()
// }

// export function loadFileAtoms(file: NodeFile) {
//   addFile(file)
//   if (file.children) {
//     file.children.forEach(loadFileAtoms)
//   }
// }

const filePathsAtom = atomWithStorage<string[]>('filePaths', [])

const _fileTreeAtom = atom<NodeFile | null>(null)

export const fileTreeAtom = atom(
  (get) => get(_fileTreeAtom),
  (get, set, file: NodeFile | typeof RESET) => {
    if (file === RESET) {
      // const filePaths = get(filePathsAtom)

      for (const [path] of fileAtomMap) {
        const fileAtom = atomWithStorage(path, RESET)
        set(fileAtom, RESET)
        fileAtomMap.delete(path)
        // fileAtomFamily.remove({ path } as NodeFile)
      }

      // set(filePathsAtom, [])
      set(_fileTreeAtom, null)

      return
    }

    // const newFilePaths: string[] = []

    const addFiles = (file: NodeFile) => {
      // newFilePaths.push(file.path)
      fileAtomMap.set(file.path, atomWithStorage(file.path, file))
      // fileAtomFamily(file)
      if (file.children) {
        file.children.forEach(addFiles)
      }
    }

    addFiles(file)

    // set(filePathsAtom, newFilePaths)
    set(_fileTreeAtom, file)
  }
)

export const currentPathAtom = atomWithReset<string | null>(null)

const fileChangesDefaults = {
  additions: [],
  deletions: []
}

export const fileChangesAtom = atomWithStorage<CreateCommitFileChanges>(
  'fileChanges',
  fileChangesDefaults
)

export const addDeletionAtom = atom<null, NodeFileDeletion>(
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

export const removeDeletionAtom = atom<null, NodeFileDeletion>(
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

export const addAdditionAtom = atom<null, NodeFileAddition>(
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

export const removeAdditionAtom = atom<null, NodeFileDeletion>(
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
    const fileAtom = getFileAtom(update)
    const file = get(fileAtom)

    if (!file) {
      return
    }

    const payload = { ...file, text: update.text }

    if (!file.isDirty) {
      payload.isDirty = true
      payload.initialText = file.text
    } else {
      payload.isDirty = file.initialText !== update.text
      set(removeAdditionAtom, update)
    }

    set(fileAtom, payload)
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

export const removeFileAtom = atom<null, NodeFilePath>(
  null,
  (get, set, node) => {
    const fileAtom = getFileAtom(node)
    const file = get(fileAtom)

    if (!file) {
      return
    }

    set(fileAtom, { ...file, isDeleted: true })
  }
)

export const restoreFileAtom = atom<null, NodeFilePath>(
  null,
  (get, set, node) => {
    const fileAtom = getFileAtom(node)
    const file = get(fileAtom)

    if (!file) {
      return
    }

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
