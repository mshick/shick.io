import type { GitInfo } from '../types'
import path from 'path'
import dateFns from 'date-fns-tz'
import git from 'simple-git'

const { zonedTimeToUtc } = dateFns

export async function getGitInfo(
  repoFolder: string,
  filePath: string
): Promise<GitInfo> {
  const gitRepo = git(repoFolder)

  const logOptions = {
    file: filePath,
    n: 1,
    format: {
      date: `%ai`,
      authorName: `%an`,
      authorEmail: '%ae',
    },
  }

  const log = await gitRepo.log(logOptions)

  if (!log.latest) {
    return {
      latestAuthorName: null,
      latestAuthorEmail: null,
      latestDate: null,
    }
  }

  return {
    latestAuthorName: log.latest.authorName,
    latestAuthorEmail: log.latest.authorEmail,
    latestDate: log.latest.date,
  }
}

const gitInfoCache = {}

export async function getGitInfoCached(
  repoFolder: string,
  filePath: string
): Promise<GitInfo> {
  if (!gitInfoCache[filePath]) {
    gitInfoCache[filePath] = await getGitInfo(repoFolder, filePath)
  }
  return gitInfoCache[filePath]
}

export function createDateWithGitFallbackGetter(
  baseDir: string,
  contentDir: string,
  timezone: string
) {
  return async (maybeDate, sourceFilePath): Promise<string> => {
    const { latestDate } = await getGitInfoCached(
      baseDir,
      path.join(contentDir, sourceFilePath)
    )
    const date = maybeDate
      ? zonedTimeToUtc(maybeDate, timezone)
      : latestDate
      ? new Date(latestDate)
      : null
    return date ? date.toISOString() : new Date().toISOString()
  }
}
