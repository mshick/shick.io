import { Provider } from 'jotai'
import Split from 'react-split'
import { TreeRoot } from './components/FileTree/TreeRoot'
import { FileViewer } from './components/FileViewer/FileViewer'
import { EditorProvider } from './data/provider'
import { Repo } from './types'

export type EditorProp = {
  accessToken: string
  repo: Repo
}

export function Editor({ accessToken, repo }: EditorProp) {
  return (
    <Provider>
      <EditorProvider provider="github" repo={repo} accessToken={accessToken}>
        <Split
          sizes={[25, 75]}
          minSize={300}
          gutterStyle={() => ({
            backgroundColor: 'rgb(245 245 245)',
            width: '10px',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '50%',
            backgroundImage: `url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==')`,
            cursor: 'col-resize'
          })}
          className="flex flex-row min-h-screen"
        >
          <TreeRoot repo={repo} />
          <FileViewer repo={repo} />
        </Split>
      </EditorProvider>
    </Provider>
  )
}
