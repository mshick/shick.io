import { ClientContext, GraphQLClient } from 'graphql-hooks'
import { useState } from 'react'
import { FileEditor } from './FileEditor/FileEditor'
import { FileList } from './FileList/FileList'
import { File } from './types'

export type EditorProp = {
  accessToken: string
}

export function Editor({ accessToken }: EditorProp) {
  const client = new GraphQLClient({
    url: 'https://api.github.com/graphql',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  const [file, setFile] = useState<File>()

  return (
    <ClientContext.Provider value={client}>
      <div className="grid grid-cols-2 min-h-screen">
        <FileList onClickFile={(file: File) => setFile(file)} />
        <FileEditor file={file} />
      </div>
    </ClientContext.Provider>
  )
}
