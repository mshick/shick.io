import { File, ParentFile, TextFile } from './types'

export function isParentFile(file: File): file is ParentFile {
  return file.type === 'parent'
}

export function isTextFile(file: File): file is TextFile {
  return file.type === 'text'
}
