import { QueryFunctionContext } from '@tanstack/react-query'
import { CreateCommit, CreateCommitResponse, NodeFile } from '../types'

export type ProviderProps = {
  provider: 'github'
}

export type EditorMethodContext = QueryFunctionContext<string[]>

export type EditorContextMethods = {
  getFileTree: (context: EditorMethodContext) => Promise<NodeFile>
  getFile: (context: EditorMethodContext) => Promise<NodeFile>
  createCommit: (variables: CreateCommit) => Promise<CreateCommitResponse>
}
