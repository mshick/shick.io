import { createContext, useContext } from 'react'
import { EditorQuery } from './hooks'

export type EditorContext = {
  queries: {
    getFileTree: EditorQuery
  }
  mutations: {
    commitChanges: EditorQuery
  }
}

export const EditorContext = createContext<EditorContext | undefined>(undefined)

export function useEditorContext() {
  const context = useContext(EditorContext)
  if (context === undefined) {
    throw new Error('useEditorContext must be within EditorProvider')
  }

  return context
}
