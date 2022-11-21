import Image from '#/components/Image'
import { MouseEventHandler, useCallback, useEffect, useState } from 'react'
import { useEditorContext } from '../data/context'
import { useEditorMutation } from '../data/hooks'
import { useFileAtom } from '../store'
import { Repo } from '../types'
import ScriptEditor, { MonacoOnInitializePane } from './ScriptEditor'

type FileEditorProps = {
  repo: Repo
}

export function FileViewer({ repo }: FileEditorProps) {
  const { file, removeFile } = useFileAtom()

  const { mutations } = useEditorContext()
  const [commitChanges] = useEditorMutation({
    mutation: mutations.commitChanges
  })

  const [code, setCode] = useState<string>('')

  useEffect(() => {
    if (file?.type === 'text') {
      setCode(file.text)
    } else {
      setCode('')
    }
  }, [file])

  const onInitializePane: MonacoOnInitializePane = useCallback(
    (monacoEditorRef, editorRef, model) => {
      editorRef.current.setScrollTop(1)
      editorRef.current.setPosition({
        lineNumber: 2,
        column: 0
      })
      editorRef.current.focus()
      monacoEditorRef.current.setModelMarkers(model[0], 'owner', null)
    },
    []
  )

  const onReset: MouseEventHandler = useCallback(
    (event) => {
      event.stopPropagation()
      if (file?.type === 'text') {
        setCode(file.text)
      }
    },
    [file]
  )

  const onCommit: MouseEventHandler = useCallback(
    async (event) => {
      event.stopPropagation()
      if (!file) {
        return
      }

      commitChanges({
        fileChanges: {
          additions: [
            {
              path: file.path,
              contents: Buffer.from(code).toString('base64')
            }
          ]
        }
      })
    },
    [code, commitChanges, file]
  )

  const onDelete = useCallback(() => {
    removeFile()
  }, [removeFile])

  let Component: JSX.Element | null

  if (file?.type === 'binary') {
    Component = (
      <Image
        src={`https://github.com/${repo.owner}/${repo.name}/raw/${repo.branch}/${file.path}`}
        alt={file.name}
      />
    )
  } else if (file?.type === 'text') {
    Component = (
      <ScriptEditor
        path={file?.type === 'text' ? file.path : ''}
        language={file?.type === 'text' ? file.language : 'plaintext'}
        code={code}
        setCode={setCode}
        onInitializePane={onInitializePane}
      />
    )
  } else {
    Component = null
  }

  return (
    <div className="min-h-screen relative">
      {file && (
        <div className="fixed top-0 h-10 px-12 w-[inherit] flex align-middle items-center border-b">
          {file.path}
        </div>
      )}
      <div className="mt-10 mb-14zz">{Component}</div>
      {file && (
        <div className="fixed bottom-0 h-14 px-12 w-[inherit] flex items-center justify-end gap-2 border-t">
          <button
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-2 py-1 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={onReset}
          >
            Reset
          </button>
          <button
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-2 py-1 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={onCommit}
          >
            Commit
          </button>
          <button
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-2 py-1 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
