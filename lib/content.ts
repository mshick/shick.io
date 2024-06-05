import { join } from 'node:path'
import { contentTypePathMap } from '../env'

export function getContentPath(contentType: string, slug: string) {
  return join(contentTypePathMap[contentType] ?? `/${contentType}`, slug)
}
