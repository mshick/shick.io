import { HTMLProps } from 'react'

export function ActionButton({
  children,
  type,
  ...props
}: HTMLProps<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-2 py-1 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-600 disabled:hover:bg-gray-600"
      {...props}
    >
      {children}
    </button>
  )
}
