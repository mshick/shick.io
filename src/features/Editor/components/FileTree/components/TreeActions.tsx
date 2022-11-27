import { useFileTreeManualQuery } from '#/features/Editor/data/hooks'
import { isCommittingAtom, useFileTreeActions } from '#/features/Editor/store'
import { useAtom } from 'jotai'
import { useCallback } from 'react'
import { ActionButton } from '../../Buttons/ActionButton'

export function TreeActions() {
  const [getFileTree] = useFileTreeManualQuery()
  const { hasChanges } = useFileTreeActions()
  const [isCommitting, setIsCommitting] = useAtom(isCommittingAtom)

  const handleCommit = useCallback(() => {
    setIsCommitting(true)
  }, [setIsCommitting])

  const handleReset = useCallback(() => {
    getFileTree()
  }, [getFileTree])

  return (
    <div className="mx-2 h-14 px-2 w-full flex align-middle items-center border-b gap-2">
      <ActionButton
        onClick={handleCommit}
        disabled={!hasChanges || isCommitting}
      >
        Commit
      </ActionButton>
      <ActionButton
        onClick={handleReset}
        disabled={!hasChanges || isCommitting}
      >
        Reset
      </ActionButton>
    </div>
  )
}
