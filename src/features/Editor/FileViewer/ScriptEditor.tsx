import Editor from '@monaco-editor/react'
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef
} from 'react'
import { TextFile } from '../types'

export type MonacoEditorOptions = Record<string, unknown> & {
  stopRenderingLineAfter: number
}

export type MonacoEditorA = MutableRefObject<any>
export type MonacoEditorB = MutableRefObject<any>
export type MonacoTextModal = any

export type MonacoOnInitializePane = (
  monacoEditorRef: MonacoEditorA,
  editorRef: MonacoEditorB,
  model: MonacoTextModal
) => void

export type ScriptEditorProps = {
  path: string
  language: TextFile['language']
  code: string
  setCode: Dispatch<SetStateAction<string>>
  editorOptions?: MonacoEditorOptions
  onInitializePane: MonacoOnInitializePane
}

const ScriptEditor = (props: ScriptEditorProps): JSX.Element => {
  const { path, language, code, setCode, editorOptions, onInitializePane } =
    props

  const monacoEditorRef = useRef<any | null>(null)
  const editorRef = useRef<any | null>(null)

  useEffect(() => {
    if (monacoEditorRef?.current) {
      const model: any = monacoEditorRef.current.getModels()
      if (model?.length > 0) {
        onInitializePane(monacoEditorRef, editorRef, model)
      }
    }
  }, [onInitializePane])

  return (
    <Editor
      height="calc(100vh - 6.5rem)"
      language={language}
      onChange={(value, _event) => {
        setCode(value ?? '')
      }}
      onMount={(editor, monaco) => {
        monacoEditorRef.current = monaco.editor
        editorRef.current = editor
      }}
      options={{
        ...editorOptions,
        wordWrap: 'on',
        automaticLayout: true,
        scrollBeyondLastLine: false,
        stopRenderingLineAfter: editorOptions?.stopRenderingLineAfter ?? 1000,
        minimap: {
          enabled: false
        }
      }}
      path={path}
      value={code}
      width="100%"
    />
  )
}

export default ScriptEditor
