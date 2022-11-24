import { useFileTreeActions } from '#/features/Editor/store'
import { ActionButton } from '../../Buttons/ActionButton'

export function TreeActions() {
  const { commitChanges } = useFileTreeActions()

  return (
    <div className="mx-2 h-10 px-2 w-full flex align-middle items-center border-b">
      <ActionButton onClick={commitChanges}>Commit</ActionButton>
    </div>
  )
}
