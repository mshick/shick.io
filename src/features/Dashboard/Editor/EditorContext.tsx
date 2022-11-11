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
  setFile: Dispatch<SetStateAction<LeafFile | null>>
}

const editorContextDefaults = {
  file: null,
  setFile: () => {}
}

const EditorContext = createContext<EditorContextValues>(editorContextDefaults)

export function EditorProvider({ children }: PropsWithChildren) {
  const [file, setFile] = useState<LeafFile | null>(null)

  return (
    <EditorContext.Provider
      value={{
        file,
        setFile
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}

export const useEditor = () => {
  return useContext(EditorContext)
}
