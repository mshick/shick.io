import path from 'path'
import { contentTypePathMap } from '../env'

export function getContentPath(contentType: string, slug: string) {
  return path.join(contentTypePathMap[contentType] ?? `/${contentType}`, slug)
}
