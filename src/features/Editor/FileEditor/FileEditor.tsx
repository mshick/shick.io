import Image from '#/components/Image'
import { useManualQuery, useMutation } from 'graphql-hooks'
import { useAtomValue } from 'jotai'
import { MouseEventHandler, useCallback, useEffect, useState } from 'react'
import { commitChangesQuery, headOidQuery } from '../queries'
import { currentFileAtomAtom } from '../store'
import { Repo } from '../types'
import ScriptEditor, { MonacoOnInitializePane } from './ScriptEditor'

type HeadOidResponse = {
  repository: {
    defaultBranchRef: {
      target: {
        history: {
          nodes: [
            {
              oid: string
            }
          ]
        }
      }
    }
  }
}

type CommitChangesResponse = {
  clientMutationId: string
}

type CommitChangesVariables = {
  input: {
    expectedHeadOid: string
    branch: {
      repositoryNameWithOwner: string
      branchName: string
    }
    message: {
      headline: string
    }
    fileChanges: {
      additions?: [
        {
          path: string
          contents: string
        }
      ]
      deletions?: [
        {
          path: string
        }
      ]
    }
  }
}

type FileEditorProps = {
  repo: Repo
}

export function FileEditor({ repo }: FileEditorProps) {
  const fileAtom = useAtomValue(currentFileAtomAtom)
  const file = useAtomValue(fileAtom)

  const [getHeadOid] = useManualQuery<HeadOidResponse>(headOidQuery)

  const [commitChanges] = useMutation<
    CommitChangesResponse,
    CommitChangesVariables,
    CommitChangesVariables
  >(commitChangesQuery)

  const [code, setCode] = useState<string>('')

  useEffect(() => {
    if (file?.type === 'text') {
      setCode(file.text)
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

      const headOidResponse = await getHeadOid({
        variables: { name: repo.name, owner: repo.owner }
      })

      const expectedHeadOid =
        headOidResponse.data?.repository.defaultBranchRef.target.history
          .nodes[0].oid

      if (!expectedHeadOid) {
        return
      }

      commitChanges({
        variables: {
          input: {
            expectedHeadOid,
            branch: {
              repositoryNameWithOwner: `${repo.owner}/${repo.name}`,
              branchName: repo.branch
            },
            message: {
              headline: 'will it blend?'
            },
            fileChanges: {
              additions: [
                {
                  path: file.path,
                  contents: Buffer.from(code).toString('base64')
                }
              ]
            }
          }
        }
      })
    },
    [code, commitChanges, file, getHeadOid, repo.branch, repo.name, repo.owner]
  )

  let Component: JSX.Element

  if (file?.type === 'binary') {
    Component = (
      <Image
        src={`https://github.com/${repo.owner}/${repo.name}/raw/${repo.branch}/${file.path}`}
        alt={file.name}
      />
    )
  } else {
    Component = (
      <ScriptEditor
        path={file?.type === 'text' ? file.path : ''}
        language={file?.type === 'text' ? file.language : 'plaintext'}
        code={code}
        setCode={setCode}
        onInitializePane={onInitializePane}
      />
    )
  }

  return (
    <div className="min-h-screen relative">
      <div className="fixed top-0 h-8 px-12 w-[inherit] bg-neutral-100 flex align-middle items-center">
        {file?.path}
      </div>
      <div className="mt-8 mb-16">{Component}</div>
      <div className="fixed bottom-0 h-16 px-12 w-[inherit] bg-neutral-100 flex items-center justify-end gap-2">
        <button
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={onReset}
        >
          Reset
        </button>
        <button
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={onCommit}
        >
          Commit
        </button>
      </div>
    </div>
  )
}
