import git from 'simple-git'
import logger from './logger'
import { GitFileInfo } from './types'

export async function getGitFileInfo(
  repoFolder: string,
  filePath: string
): Promise<GitFileInfo> {
  const gitRepo = git(repoFolder)

  const logOptions = {
    file: filePath,
    n: 1,
    format: {
      date: `%ai`,
      authorName: `%an`,
      authorEmail: '%ae'
    }
  }

  try {
    const { latest } = await gitRepo.log(logOptions)

    return {
      latestAuthorName: latest?.authorName ?? '',
      latestAuthorEmail: latest?.authorEmail ?? '',
      latestDate: latest?.date ?? ''
    }
  } catch (e) {
    logger.debug(e, `${filePath} not found in repo`)
    return {
      latestAuthorName: '',
      latestAuthorEmail: '',
      latestDate: ''
    }
  }
}
