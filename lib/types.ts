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
