import * as base64 from '#/utils/base64'
import { useManualQuery, useMutation } from 'graphql-hooks'
import { MouseEventHandler, useCallback, useEffect, useState } from 'react'
import { File } from '../types'
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

const headOidQuery = /* GraphQL */ `
  query ($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      defaultBranchRef {
        target {
          ... on Commit {
            history(first: 1) {
              nodes {
                oid
              }
            }
          }
        }
      }
    }
  }
`

const commitChangesQuery = /* GraphQL */ `
  mutation ($input: CreateCommitOnBranchInput!) {
    createCommitOnBranch(input: $input) {
      clientMutationId
    }
  }
`

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

export function FileEditor({ file }: { file: File | undefined }) {
  const [getHeadOid] = useManualQuery<HeadOidResponse>(headOidQuery)

  const [commitChanges, { loading, error, data }] = useMutation<
    CommitChangesResponse,
    CommitChangesVariables,
    CommitChangesVariables
  >(commitChangesQuery)

  const [code, setCode] = useState<string>('')

  useEffect(() => {
    if (file?.text) {
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

  const onCommit: MouseEventHandler = useCallback(
    async (event) => {
      event.stopPropagation()
      if (!file) {
        return
      }

      const headOidResponse = await getHeadOid({
        variables: { name: 'shick.io', owner: 'mshick' }
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
              repositoryNameWithOwner: 'mshick/shick.io',
              branchName: 'main'
            },
            message: {
              headline: 'will it blend?'
            },
            fileChanges: {
              additions: [
                {
                  path: file.path,
                  contents: base64.encode(code)
                }
              ]
            }
          }
        }
      })
    },
    [code, commitChanges, file]
  )

  return (
    <div className="flex flex-col">
      <div className="flex-grow">
        <ScriptEditor
          path={file?.path ?? ''}
          code={code}
          setCode={setCode}
          editorOptions={{
            stopRenderingLineAfter: 1000
          }}
          onInitializePane={onInitializePane}
        />
      </div>
      <div>
        <button onClick={onCommit}>Commit</button>
      </div>
    </div>
  )
}
