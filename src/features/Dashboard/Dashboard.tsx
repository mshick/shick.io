import { useSession } from 'next-auth/react'
import { Editor } from './Editor/Editor'

export function Dashboard() {
  const { data: session } = useSession({ required: true })

  if (!session) {
    return null
  }

  return <Editor accessToken={session.accessToken} />
}
