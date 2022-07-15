export type NavigationToggleProps = {
  label: string
  altText: string
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
}

export function NavigationToggle({
  label,
  altText,
  isOpen,
  onClose,
  onOpen
}: NavigationToggleProps) {
  return (
    <button className="inline-flex items-center justify-center p-2 hover:text-white hover:bg-blue-700 focus:outline-none">
      <span className="sr-only">{altText}</span>
      {isOpen ? (
        <span className="block" aria-hidden="true" onClick={onClose}>
          [close]
        </span>
      ) : (
        <span className="block" aria-hidden="true" onClick={onOpen}>
          [{label}]
        </span>
      )}
    </button>
  )
}
