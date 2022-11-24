import { createContext, useContext } from 'react'
import { EditorContextMethods } from './types'

export type EditorQuery = (options?: any) => Promise<any>

export type EditorContextType = {
  methods: EditorContextMethods
}

export const EditorContext = createContext<EditorContextType | undefined>(
  undefined
)

export function useEditorContext() {
  const context = useContext(EditorContext)
  if (context === undefined) {
    throw new Error('useEditorContext must be within EditorProvider')
  }

  return context
}
