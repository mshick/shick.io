import { ClientContext, GraphQLClient } from 'graphql-hooks'
import { Provider } from 'jotai'
import Split from 'react-split'
import { FileEditor } from './FileEditor/FileEditor'
import { FileTree } from './FileList/FileTree'
import { Repo } from './types'

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

  return (
    <ClientContext.Provider value={client}>
      <Provider>
        <Split sizes={[25, 75]} className="flex flex-row min-h-screen">
          <FileTree repo={repo} />
          <FileEditor repo={repo} />
        </Split>
      </Provider>
    </ClientContext.Provider>
  )
}
