import { Dialog } from '@headlessui/react'
import { useAtom } from 'jotai'
import { useCallback, useRef } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useFileTreeActions } from '../../../files/hooks'
import { isCommittingAtom } from '../../../store'
import { ActionButton } from '../../Buttons/ActionButton'
import { CancelButton } from '../../Buttons/CancelButton'
import { Modal } from '../../Modal'

interface CommitModalFormValues {
  headline: string
}

export function CommitModal() {
  const { changedFiles, createCommit } = useFileTreeActions()
  const [isCommitting, setIsCommitting] = useAtom(isCommittingAtom)
  const { register, handleSubmit } = useForm<CommitModalFormValues>()

  const { additions, deletions } = changedFiles

  const cancelButtonRef = useRef(null)

  const onSubmit: SubmitHandler<CommitModalFormValues> = useCallback(
    (data) => {
      createCommit(data)
      setIsCommitting(false)
    },
    [createCommit, setIsCommitting]
  )

  return (
    <Modal
      initialFocus={cancelButtonRef}
      isOpen={isCommitting}
      setIsOpen={setIsCommitting}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start mb-2">
            <div className="mt-3 sm:mt-0">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900 mb-4"
              >
                Changes
              </Dialog.Title>
              <div className="mt-2">
                {additions.length > 0 && (
                  <dl className="mb-4">
                    <dt className="font-bold text-sm uppercase">
                      Added or Modified
                    </dt>
                    {additions.map((path) => (
                      <dd key={path}>{path}</dd>
                    ))}
                  </dl>
                )}

                {deletions.length > 0 && (
                  <dl className="mb-4">
                    <dt className="font-bold text-sm uppercase">Removed</dt>
                    {changedFiles.deletions.map((path) => (
                      <dd key={path}>{path}</dd>
                    ))}
                  </dl>
                )}
              </div>
            </div>
          </div>

          <label
            htmlFor="headline"
            className="block text-sm font-medium text-gray-700"
          >
            Message
          </label>
          <textarea
            {...register('headline', { required: true })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
          <ActionButton type="submit">Push</ActionButton>
          <CancelButton
            onClick={() => setIsCommitting(false)}
            ref={cancelButtonRef}
          >
            Cancel
          </CancelButton>
        </div>
      </form>
    </Modal>
  )
}
