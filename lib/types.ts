import { ImageFieldData } from 'contentlayer/core'

export type GitFileInfo = {
  latestAuthorName: string
  latestAuthorEmail: string
  latestDate: string
}

export type GitConfig = {
  originUrl: string
  defaultBranch: string
}

export type Tag = {
  name: string
  path: string
  slug: string
}

export function isImageFieldData(
  maybeAsset: unknown
): maybeAsset is ImageFieldData {
  const asset = maybeAsset as ImageFieldData
  return Boolean(asset?.filePath)
}
