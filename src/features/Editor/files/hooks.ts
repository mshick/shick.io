import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  useCreateCommitMutation,
  useFileQuery,
  useFileTreeQuery
} from '../queries/hooks'
import { CreateCommitMessage } from '../types'
import { getParentPath } from '../utils/path'
import {
  addAdditionAtom,
  addDeletionAtom,
  currentPathAtom,
  fileChangesAtom,
  fileTreeAtom,
  getFileAtom,
  removeAdditionAtom,
  removeDeletionAtom,
  removeFileAtom,
  restoreFileAtom,
  updateFileTextAtom,
  _selectFileAtom
} from './store'

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

  const _addAddition = useSetAtom(addAdditionAtom)
  const _removeAddition = useSetAtom(removeAdditionAtom)

  const _addDeletion = useSetAtom(addDeletionAtom)
  const _removeDeletion = useSetAtom(removeDeletionAtom)

  const _removeFile = useSetAtom(removeFileAtom)
  const _restoreFile = useSetAtom(restoreFileAtom)
  const _selectFile = useSetAtom(_selectFileAtom)
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
      _removeDeletion(file)
    }
  }, [file, fetchFile, _removeAddition, _removeDeletion])

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

export function useFileTree() {
  const [executeQuery] = useFileTreeQuery()
  const setCurrentPath = useSetAtom(currentPathAtom)
  const [data, setData] = useAtom(fileTreeAtom)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<unknown | null>(null)

  const getFileTree = useCallback(async () => {
    console.log('getFileTree')
    if (!isLoading) {
      console.log('getFileTree not loading')

      setIsLoading(true)
      setError(null)
      setCurrentPath(null)

      try {
        const data = await executeQuery()

        // resetFileAtoms()

        // loadFileAtoms(data)
        console.log('before setData')

        setData(data)
      } catch (error) {
        setError(error)
      } finally {
        setIsLoading(false)
      }
    }
  }, [isLoading, setCurrentPath, executeQuery, setData])

  return [getFileTree, { error, data, isLoading }] as const
}

export function useFileTreeActions() {
  const [getFileTree] = useFileTree()
  const mutation = useCreateCommitMutation()
  const fileChanges = useAtomValue(fileChangesAtom)

  const createCommit = useCallback(
    (message: CreateCommitMessage) => {
      mutation.mutate({
        fileChanges,
        message
      })
    },
    [fileChanges, mutation]
  )

  const resetTree = useCallback(() => {
    getFileTree()
  }, [getFileTree])

  const hasChanges = useMemo(() => {
    return Boolean(fileChanges.additions.length || fileChanges.deletions.length)
  }, [fileChanges.additions.length, fileChanges.deletions.length])

  const changedFiles = useMemo(() => {
    return {
      additions: fileChanges.additions?.map(({ path }) => path),
      deletions: fileChanges.deletions?.map(({ path }) => path)
    }
  }, [fileChanges.additions, fileChanges.deletions])

  return {
    hasChanges,
    changedFiles,
    createCommit,
    resetTree
  }
}
