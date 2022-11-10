export type File = {
  title: string
  type?: 'tree' | 'blob'
  language?: 'markdown'
  text?: string
  addedDate?: string
  children?: File[]
}
