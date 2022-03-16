import path from 'path'
import { contentTypePathMap } from '../config'

export function getContentPath(contentType: string, slug: string) {
  return path.join(contentTypePathMap[contentType] ?? `/${contentType}`, slug)
}
