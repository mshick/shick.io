import { isCommittingAtom, useFileTreeActions } from '#/features/Editor/store'
import { Dialog, Transition } from '@headlessui/react'
import { useAtom } from 'jotai'
import { Fragment, useCallback, useRef } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

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
    <Transition.Root show={isCommitting} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => setIsCommitting(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
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
                              <dt className="font-bold text-sm uppercase">
                                Removed
                              </dt>
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
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Push
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setIsCommitting(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
