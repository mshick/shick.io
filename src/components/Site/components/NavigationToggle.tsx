export type NavigationToggleProps = {
  label: string;
  altText: string;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
};

export function NavigationToggle({
  label,
  altText,
  isOpen,
  onClose,
  onOpen,
}: NavigationToggleProps) {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center m-2 p-0 hover:text-white hover:bg-blue-700 focus:outline-hidden"
    >
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
  );
}
