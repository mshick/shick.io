import { useAtom } from 'jotai'
import { useCallback } from 'react'
import { useFileTreeActions } from '../../../files/hooks'
import { isCommittingAtom, isResettingAtom } from '../../../store'
import { ActionButton } from '../../Buttons/ActionButton'

export function TreeActions() {
  const { hasChanges, resetTree } = useFileTreeActions()
  const [isCommitting, setIsCommitting] = useAtom(isCommittingAtom)
  const [isResetting, setIsResetting] = useAtom(isResettingAtom)

  const handleCommit = useCallback(() => {
    setIsCommitting(true)
  }, [setIsCommitting])

  const handleReset = useCallback(() => {
    setIsResetting(true)
  }, [setIsResetting])

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
