import { Dialog } from '@headlessui/react'
import { useAtom } from 'jotai'
import { useCallback, useRef } from 'react'
import { useFileTreeActions } from '../../../files/hooks'
import { isResettingAtom } from '../../../store'
import { ActionButton } from '../../Buttons/ActionButton'
import { CancelButton } from '../../Buttons/CancelButton'
import { Modal } from '../../Modal'

export function ResetModal() {
  const { changedFiles, resetTree } = useFileTreeActions()
  const [isResetting, setIsResetting] = useAtom(isResettingAtom)

  const { additions, deletions } = changedFiles

  const cancelButtonRef = useRef(null)

  const onReset = useCallback(() => {
    resetTree()
    setIsResetting(false)
  }, [resetTree, setIsResetting])

  return (
    <Modal
      initialFocus={cancelButtonRef}
      isOpen={isResetting}
      setIsOpen={setIsResetting}
    >
      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start mb-2">
          <div className="mt-3 sm:mt-0">
            <Dialog.Title
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900 mb-4"
            >
              Reset Changes
            </Dialog.Title>
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-4">
                There are {additions.length} files added or modified and{' '}
                {deletions.length} files deleted.
              </p>
              <p className="text-sm text-gray-500">
                All changes will be discarded if you reset.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
        <ActionButton onClick={onReset}>Reset</ActionButton>
        <CancelButton
          onClick={() => setIsResetting(false)}
          ref={cancelButtonRef}
        >
          Cancel
        </CancelButton>
      </div>
    </Modal>
  )
}
