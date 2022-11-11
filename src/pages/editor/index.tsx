import { Editor } from '#/features/Editor/Editor'
import { useSession } from 'next-auth/react'

export default function EditorPage() {
  const { data: session } = useSession({ required: true })

  if (!session) {
    return null
  }

  return (
    <Editor
      accessToken={session.accessToken!}
      repo={{
        name: 'shick.io',
        owner: 'mshick',
        branch: 'main',
        dataDir: 'data'
      }}
    />
  )
}
