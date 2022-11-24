import { QueryFunctionContext } from '@tanstack/react-query'
import { NodeFile } from '../types'

export type ProviderProps = {
  provider: 'github'
}

export type EditorMethodContext = QueryFunctionContext<string[]>

export type EditorContextMethods = {
  getFileTree: (context: EditorMethodContext) => Promise<NodeFile>
  getFile: (context: EditorMethodContext) => Promise<NodeFile>
  commitChanges: (options: any) => Promise<any>
}
