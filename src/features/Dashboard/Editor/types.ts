export type File = {
  path: string
  title: string
  type?: 'tree' | 'blob'
  language?: 'markdown'
  text?: string
  addedDate?: string
  children?: File[]
}

export type State = {
  position?: {
    x: number
    y: number
  }
  show?: boolean
  setShow?: (s: boolean) => void
  setPosition?: ({ x, y }: { x: any; y: any }) => void
}
