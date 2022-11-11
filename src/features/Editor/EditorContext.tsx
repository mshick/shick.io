import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState
} from 'react'
import { LeafFile } from './types'

export interface EditorContextValues {
  file: LeafFile | null
}

export interface EditorSetContextValues {
  setFile: Dispatch<SetStateAction<LeafFile | null>>
}

const editorContextDefaults = {
  file: null
}

const editorSetContextDefaults = {
  setFile: () => {}
}

const EditorContext = createContext<EditorContextValues>(editorContextDefaults)

const EditorSetContext = createContext<EditorSetContextValues>(
  editorSetContextDefaults
)

export function EditorProvider({ children }: PropsWithChildren) {
  const [file, setFile] = useState<LeafFile | null>(null)

  return (
    <EditorContext.Provider value={{ file }}>
      <EditorSetContext.Provider value={{ setFile }}>
        {children}
      </EditorSetContext.Provider>
    </EditorContext.Provider>
  )
}

export const useEditorContext = () => {
  return useContext(EditorContext)
}

export const useEditorSetContext = () => {
  return useContext(EditorSetContext)
}
