import { ClientContext, GraphQLClient } from 'graphql-hooks'
import { useState } from 'react'
import Split from 'react-split'
import { FileEditor } from './FileEditor/FileEditor'
import { FileTree } from './FileList/FileTree'
import { Repo, TextFile } from './types'

export type EditorProp = {
  accessToken: string
  repo: Repo
}

export function Editor({ accessToken, repo }: EditorProp) {
  const client = new GraphQLClient({
    url: 'https://api.github.com/graphql',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  const [file, setFile] = useState<TextFile>()

  return (
    <ClientContext.Provider value={client}>
      <Split sizes={[25, 75]} className="flex flex-row min-h-screen">
        <FileTree repo={repo} onClickTextFile={(file) => setFile(file)} />
        <FileEditor repo={repo} file={file} />
      </Split>
    </ClientContext.Provider>
  )
}
